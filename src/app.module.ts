import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParcelsModule } from './parcels/parcels.module';
import { AllExceptionsFilter } from './common/filters/all-expceptions.filter';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsModule } from './notifications/notifications.module';
import { ResendModule } from 'nest-resend';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';
import { CloudflareR2Module } from './cloudflare-r2/cloudflareR2.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		JwtModule.registerAsync({
			global: true,
			useFactory: (configService: ConfigService) => ({
				secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
				signOptions: { expiresIn: '7h' },
			}),
			inject: [ConfigService],
		}),
		ResendModule.forRoot({ apiKey: process.env.RESEND_API_KEY }),
		EventEmitterModule.forRoot(),
		BullModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				connection: {
					host: configService.getOrThrow<string>('REDIS_HOST'),
					port: configService.get<number>('REDIS_PORT', 6379),
					// password: configService.get<string>('REDIS_PASSWORD'),
				},
			}),
			inject: [ConfigService],
		}),
		ParcelsModule,
		DatabaseModule,
		AuthModule,
		UsersModule,
		NotificationsModule,
		CloudflareR2Module,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
	],
})
export class AppModule {}
