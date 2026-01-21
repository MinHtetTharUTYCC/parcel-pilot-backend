import { NotificationType } from '@prisma/client';

export class CreateWebNotificationDto {
	userId: string;
	type: NotificationType;
	title: string;
	message: string;
	actionUrl?: string;
}
