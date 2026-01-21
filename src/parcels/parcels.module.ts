import { Module } from '@nestjs/common';
import { ParcelsController } from './parcels.controller';
import { ParcelsService } from './parcels.service';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { CloudflareR2Module } from 'src/cloudflare-r2/cloudflareR2.module';

@Module({
	imports: [DatabaseModule, AuthModule, CloudflareR2Module],
	controllers: [ParcelsController],
	providers: [ParcelsService],
	exports: [ParcelsService],
})
export class ParcelsModule {}
