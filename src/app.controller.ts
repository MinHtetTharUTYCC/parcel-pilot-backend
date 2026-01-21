import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@ApiOperation({
		summary: 'Health Check',
		description: 'Check if the API server is running and healthy.',
	})
	@ApiResponse({
		status: 200,
		description: 'Server is healthy and running',
		schema: {
			example: 'Hello Parcels!',
		},
	})
	getHello(): string {
		return this.appService.getHello();
	}
}
