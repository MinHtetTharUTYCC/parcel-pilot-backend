import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	UseInterceptors,
} from '@nestjs/common';
import { PickupReminderCron } from './cron/pick-up-reminder.cron';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { WebNotificationsService } from './services/web-notifications.service';
import { ReqUser } from 'src/auth/decorators/req-user.decorator';
import { RequestUser } from 'src/auth/interfaces/auth.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('notifications')
@UseInterceptors(SuccessResponseInterceptor)
export class NotificationsController {
	constructor(
		private pickupReminderCron: PickupReminderCron,
		private webNotificationsService: WebNotificationsService,
	) {}

	@Post('test-pickup-reminders')
	@Auth('MANAGER')
	async testPickupReminders() {
		await this.pickupReminderCron.triggerManually();
		return { message: 'Pickup reminder job triggered' };
	}

	@Get()
	@Auth('RESIDENT')
	async getNotifications(
		@ReqUser() user: RequestUser,
		@Query() dto: PaginationDto,
	) {
		return this.webNotificationsService.getNotifications(user.sub, dto);
	}
}
