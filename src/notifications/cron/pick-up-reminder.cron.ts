import { Injectable, Logger } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { Cron } from '@nestjs/schedule';
import { ParcelsService } from 'src/parcels/parcels.service';
import {
	NotificationChannel,
	NotificationPriority,
} from '../enums/notification-type.enum';

const ONE_DAY_MILLIS = 1000 * 60 * 60 * 24;

@Injectable()
export class PickupReminderCron {
	private readonly logger = new Logger(PickupReminderCron.name);

	constructor(
		private notificationsService: NotificationsService,
		private parcelsService: ParcelsService,
	) {}

	@Cron('0 0 9 * * *', { name: 'pickup-reminder', timeZone: 'Asia/Bangkok' })
	async sendPickupReminders() {
		this.logger.log('Starting pickup reminder cron job...');

		try {
			const pendingParcels = await this.parcelsService.getPendingParcels();

			if (pendingParcels.length === 0) {
				this.logger.log('No pending parcels to remind.');
				return;
			}

			this.logger.log(`Found ${pendingParcels.length} parcels pending pickup`);

			const now = new Date();
			let successCount = 0;
			let failCount = 0;

			for (const parcel of pendingParcels) {
				const millisWaiting = now.getTime() - parcel.registeredAt.getTime();

				const daysWaiting = Math.floor(millisWaiting / ONE_DAY_MILLIS);
				if (daysWaiting < 1) continue;

				try {
					const priority =
						daysWaiting >= 7
							? NotificationPriority.HIGH
							: NotificationPriority.MEDIUM;

					await this.notificationsService.sendNotification(
						{
							type: 'PICKUP_REMINDER',
							userId: parcel.recipientId,
							parcelId: parcel.id,
							residentEmail: parcel.recipient.email,
							channels: [NotificationChannel.EMAIL, NotificationChannel.WEB],
							priority: priority,
							data: {
								recipientName: parcel.recipient.name,
								unitNumber: parcel.recipient.unitNumber,
								orderId: parcel.orderId || 'N/A',
								pickupCode: parcel.pickupCode,
								imgUrl: parcel.imageUrl,
								daysWaiting: daysWaiting,
								registeredAt: parcel.registeredAt,
							},
						},
						true,
					);

					successCount++;
					this.logger.debug(
						`Reminder sent for parcel ${parcel.id} (${daysWaiting} days old) to ${parcel.recipient.name}`,
					);
				} catch (error) {
					failCount++;
					this.logger.error(
						`Failed to send reminder for parcel ${parcel.id}: ${error.message}`,
					);
				}
			}

			this.logger.log(
				`Pickup reminder job completed: ${successCount} sent, ${failCount} failed`,
			);
		} catch (error) {
			this.logger.error(
				'Pickup reminder cron job failed:',
				error.message,
				error.stack,
			);
		}
	}

	async triggerManually() {
		this.logger.log('Manually triggering pickup reminder job...');
		await this.sendPickupReminders();
	}
}
