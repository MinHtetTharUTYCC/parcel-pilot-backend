import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from 'src/common/consts/event-names';
import { ResidentApprovedEvent } from '../events/resident-approved.event';
import { NotificationType } from '@prisma/client';
import {
	NotificationChannel,
	NotificationPriority,
} from '../enums/notification-type.enum';
import { NotificationData } from '../interfaces/notification-payload.interface';
import { ResidentRejectedEvent } from '../events/resident-rejected.event';

@Injectable()
export class ResidentEventsListener {
	constructor(private notificationsService: NotificationsService) {}

	@OnEvent(events.approved)
	async handleResidentApproved(payload: ResidentApprovedEvent) {
		const notificationData = {
			recipientName: payload.recipientName,
			unitNumber: payload.unitNumber,
			approvedAt: payload.approvedAt,
		} as NotificationData;

		await this.notificationsService.sendNotification({
			type: NotificationType.ACCOUNT_APPROVED,
			userId: payload.recipientId,
			residentEmail: payload.residentEmail,
			data: notificationData,
			channels: [NotificationChannel.EMAIL],
			priority: NotificationPriority.HIGH,
		});
	}

	@OnEvent(events.rejected)
	async handleResidentRejected(payload: ResidentRejectedEvent) {
		const notificationData = {
			recipientName: payload.recipientName,
			unitNumber: payload.unitNumber,
			rejectedAt: payload.rejectedAt,
		} as NotificationData;

		await this.notificationsService.sendNotification({
			type: NotificationType.ACCOUNT_REJECTED,
			userId: payload.recipientId,
			residentEmail: payload.residentEmail,
			data: notificationData,
			channels: [NotificationChannel.EMAIL],
			priority: NotificationPriority.HIGH,
		});
	}
}
