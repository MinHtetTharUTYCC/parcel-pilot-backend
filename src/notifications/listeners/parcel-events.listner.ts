import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { NotificationType } from '@prisma/client';
import { OnEvent } from '@nestjs/event-emitter';
import {
	NotificationChannel,
	NotificationPriority,
} from '../enums/notification-type.enum';
import { ParcelRegisteredEvent } from '../events/parcel-registered.event';
import { ParcelPickedupEvent } from '../events/parcel-pickedup.event';
import { NotificationData } from '../interfaces/notification-payload.interface';
import { ParcelReturnedEvent } from '../events/parcel-returned.event';
import { events } from 'src/common/consts/event-names';

@Injectable()
export class ParcelEventsListener {
	constructor(private notificationsService: NotificationsService) {}

	@OnEvent(events.registered)
	async handleParcelRegistered(payload: ParcelRegisteredEvent) {
		const notificationData = {
			recipientName: payload.recipientName,
			unitNumber: payload.unitNumber,
			pickupCode: payload.pickupCode,
			courier: payload.courier,
			imgUrl: payload.imageUrl,
			registeredAt: payload.registeredAt,
		} as NotificationData;

		await this.notificationsService.sendNotification(
			{
				type: NotificationType.PARCEL_READY,
				userId: payload.recipientId,
				parcelId: payload.parcelId,
				residentEmail: payload.residentEmail,
				data: notificationData,
				channels: [NotificationChannel.EMAIL, NotificationChannel.WEB],
				priority: NotificationPriority.LOW,
			},
			false,
		);
	}

	@OnEvent(events.pickedup)
	async parcelPickedup(payload: ParcelPickedupEvent) {
		const notificationData = {
			recipientName: payload.recipientName,
			unitNumber: payload.unitNumber,
			pickupCode: payload.pickupCode,
			courier: payload.courier,
			imgUrl: payload.imageUrl,
			pickedupAt: payload.pickedupAt,
		} as NotificationData;

		await this.notificationsService.sendNotification(
			{
				type: NotificationType.PARCEL_PICKED_UP,
				userId: payload.recipientId,
				parcelId: payload.parcelId,
				residentEmail: payload.residentEmail,
				data: notificationData,
				channels: [NotificationChannel.EMAIL, NotificationChannel.WEB],
				priority: NotificationPriority.HIGH,
			},
			false,
		);
	}

	@OnEvent(events.returned)
	async parcelReturned(payload: ParcelReturnedEvent) {
		const notificationData = {
			recipientName: payload.recipientName,
			unitNumber: payload.unitNumber,
			pickupCode: payload.pickupCode,
			courier: payload.courier,
			imgUrl: payload.imageUrl,
			returnedAt: payload.returnedAt,
		} as NotificationData;

		await this.notificationsService.sendNotification(
			{
				type: NotificationType.PARCEL_RETURNED,
				userId: payload.recipientId,
				parcelId: payload.parcelId,
				residentEmail: payload.residentEmail,
				data: notificationData,
				channels: [NotificationChannel.EMAIL, NotificationChannel.WEB],
				priority: NotificationPriority.HIGH,
			},
			false,
		);
	}
}
