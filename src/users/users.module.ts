import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { CloudflareR2Module } from 'src/cloudflare-r2/cloudflareR2.module';

@Module({
	imports: [DatabaseModule, CloudflareR2Module],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
