import { Injectable, Logger } from '@nestjs/common';
import { CreateWebNotificationDto } from './dto/create-web-notification.dto';
import { DatabaseService } from 'src/database/database.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Prisma } from '@prisma/client';

const notificationSelector: Prisma.NotificationSelect = {
	id: true,
	type: true,
	title: true,
	message: true,
	isRead: true,
	actionUrl: true,
	createdAt: true,
};

@Injectable()
export class WebNotificationsService {
	constructor(private readonly databaseService: DatabaseService) {}

	private readonly logger = new Logger(WebNotificationsService.name);

	async create(dto: CreateWebNotificationDto) {
		try {
			const notificaion = await this.databaseService.notification.create({
				data: { ...dto },
				select: notificationSelector,
			});

			return notificaion;
		} catch (error) {
			this.logger.error('Failed to create web notification', error);
			throw error;
		}
	}

	async getNotifications(userId: string, dto: PaginationDto) {
		const { cursor, limit } = dto;

		const notifications = await this.databaseService.notification.findMany({
			where: { userId },
			cursor: cursor ? { id: cursor } : undefined,
			skip: cursor ? 1 : 0,
			take: limit + 1,
			orderBy: { createdAt: 'desc' },
			select: notificationSelector,
		});

		const hasNext = notifications.length > limit;
		const items = hasNext ? notifications.slice(0, -1) : notifications;
		const nextCursor = hasNext ? items[items.length - 1].id : null;

		return {
			data: items,
			meta: { limit, hasNext, nextCursor },
		};
	}
}
