import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// CORS for Vercel frontend
	const corsOrigins = process.env.CORS_ORIGINS?.split(',') || [
		'http://localhost:5173',
		'http://localhost:3000',
	];

	app.enableCors({
		origin: corsOrigins,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
	});

	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	// Setup Swagger Documentation
	const config = new DocumentBuilder()
		.setTitle('Parcel Pilot API')
		.setDescription(
			'API documentation for Parcel Pilot - A parcel management system',
		)
		.setVersion('1.0.0')
		.addTag(
			'Auth',
			'Authentication endpoints for login, signup, and token management',
		)
		.addTag('Users', 'User management endpoints for residents and staff')
		.addTag(
			'Parcels',
			'Parcel management endpoints for creating, updating, and tracking parcels',
		)
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				description: 'Enter JWT token',
			},
			'access-token',
		)
		.addCookieAuth('refresh_token', {
			type: 'apiKey',
			in: 'cookie',
			name: 'refresh_token',
			description: 'Refresh token stored in HTTP-only cookie',
		})
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	});

	await app.listen(process.env.PORT ?? 6000);
}
void bootstrap();
