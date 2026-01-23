import {
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { PickupReminderCron } from "./cron/pick-up-reminder.cron";
import { SuccessResponseInterceptor } from "src/common/interceptors/success-response.interceptor";
import { Auth } from "src/auth/decorators/auth.decorator";
import { WebNotificationsService } from "./services/web-notifications.service";
import { ReqUser } from "src/auth/decorators/req-user.decorator";
import { RequestUser } from "src/auth/interfaces/auth.interface";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { NotificationListResponseDto } from "src/common/responses/notification-response.dto";
import { ForbiddenResponseDto } from "src/common/responses/error-response.dto";

@Controller("notifications")
@UseInterceptors(SuccessResponseInterceptor)
export class NotificationsController {
  constructor(
    private pickupReminderCron: PickupReminderCron,
    private webNotificationsService: WebNotificationsService,
  ) { }

  @Post("test-pickup-reminders")
  @Auth("MANAGER")
  async testPickupReminders() {
    await this.pickupReminderCron.triggerManually();
    return { message: "Pickup reminder job triggered" };
  }

  @Get()
  @Auth("RESIDENT")
  @ApiOperation({
    summary: "Get User Notifications",
    description:
      "Retrieve a paginated list of notifications for the authenticated user. Only RESIDENT role can access this.",
  })
  @ApiResponse({
    status: 200,
    description: "List of notifications retrieved successfully",
    type: NotificationListResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
    type: ForbiddenResponseDto,
  })
  async getNotifications(
    @ReqUser() user: RequestUser,
    @Query() dto: PaginationDto,
  ): Promise<NotificationListResponseDto> {
    return this.webNotificationsService.getNotifications(user.sub, dto);
  }
}
