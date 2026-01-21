import { ParcelStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateParcelStatusDto {
	@ApiProperty({
		description: 'New status for the parcel',
		enum: ParcelStatus,
		example: 'PICKED_UP',
	})
	@IsEnum(ParcelStatus)
	@IsNotEmpty()
	status: ParcelStatus;

	@ApiPropertyOptional({
		description:
			'ID of the resident (required when marking parcel as picked up)',
		type: String,
		example: 'resident-id-123',
	})
	@IsOptional()
	@IsString()
	residentId?: string;
}
