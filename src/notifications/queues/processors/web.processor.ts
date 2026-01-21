import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { WebJob } from 'src/notifications/interfaces/notification-payload.interface';
import { WebNotificationsService } from 'src/notifications/services/web-notifications.service';

@Processor('web-notifications', { concurrency: 5 })
@Injectable()
export class WebNotificationsProcessor extends WorkerHost {
	private readonly logger = new Logger(WebNotificationsProcessor.name);

	constructor(private webNotificationsService: WebNotificationsService) {
		super();
		this.logger.log('🏃‍➡️ WebNotificationsProcessor initialized');
	}

	async process(job: Job<WebJob>) {
		if (job.name !== 'send-web') {
			return; //skip other jobs
		}

		// destructure is only for log use, dto is already same as job in this case
		const { userId, type } = job.data;

		try {
			const newNotification = await this.webNotificationsService.create(
				job.data,
			);

			this.logger.log(
				`Web notification ${newNotification.id} sent successfully to ${userId} for ${type}`,
			);

			// await this.logNotification(userId, type, 'WEB', 'SENT');
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			const errorStack = error instanceof Error ? error.stack : undefined;
			this.logger.error(
				`Failed to send web notification to ${userId}: ${errorMessage}`,
				errorStack,
			);
			// await this.logNotification(userId, type, 'WEB', 'FAILED', error.message);
			throw error; // BULL WILL RETRY
		}
	}
}
