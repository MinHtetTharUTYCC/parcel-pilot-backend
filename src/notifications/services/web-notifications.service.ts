import { Injectable, Logger } from "@nestjs/common";
import { CreateWebNotificationDto } from "./dto/create-web-notification.dto";
import { DatabaseService } from "src/database/database.service";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { Prisma } from "@prisma/client";
import { NotificationListResponseDto } from "src/common/responses/notification-response.dto";

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
  constructor(private readonly databaseService: DatabaseService) { }

  private readonly logger = new Logger(WebNotificationsService.name);

  async create(dto: CreateWebNotificationDto) {
    try {
      const notificaion = await this.databaseService.notification.create({
        data: { ...dto },
        select: notificationSelector,
      });

      return notificaion;
    } catch (error) {
      this.logger.error("Failed to create web notification", error);
      throw error;
    }
  }

  async getNotifications(userId: string, dto: PaginationDto): Promise<NotificationListResponseDto> {
    const { page, limit } = dto;

    const [totalNotifications, notifications] = await Promise.all([
      this.databaseService.notification.count({ where: { userId } }),
      this.databaseService.notification.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: notificationSelector,
      }),
    ])

    const hasNext = notifications.length >= limit;
    const totalPages = Math.ceil(totalNotifications / limit);

    return {
      data: notifications,
      meta: { page, limit, hasNext, total: totalNotifications, totalPages },
    };
  }
}
