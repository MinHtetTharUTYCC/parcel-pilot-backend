import { ApiProperty } from '@nestjs/swagger';

export class ParcelRecipientDto {
	@ApiProperty({
		description: 'Recipient user ID',
		example: 'resident-id-123',
		type: String,
	})
	id: string;

	@ApiProperty({
		description: 'Recipient name',
		example: 'John Doe',
		type: String,
	})
	name: string;

	@ApiProperty({
		description: 'Recipient email',
		example: 'john@example.com',
		type: String,
	})
	email: string;

	@ApiProperty({
		description: 'Recipient unit number',
		example: 'A-101',
		type: String,
	})
	unitNumber: string;

	@ApiProperty({
		description: 'Recipient phone number',
		example: '+1234567890',
		type: String,
		nullable: true,
	})
	phone?: string;
}

export class ParcelResponseDto {
	@ApiProperty({
		description: 'Parcel ID',
		example: 'parcel-id-123',
		type: String,
	})
	id: string;

	@ApiProperty({
		description: 'Order ID from courier',
		example: 'ORD-2026-001',
		type: String,
		nullable: true,
	})
	orderId?: string;

	@ApiProperty({
		description: 'Recipient ID',
		example: 'resident-id-123',
		type: String,
	})
	recipientId: string;

	@ApiProperty({
		description: 'Recipient information',
		type: ParcelRecipientDto,
		nullable: true,
	})
	recipient?: ParcelRecipientDto;

	@ApiProperty({
		description: 'Parcel description',
		example: 'Electronics - Headphones',
		type: String,
		nullable: true,
	})
	description?: string;

	@ApiProperty({
		description: 'Additional notes',
		example: 'Handle with care - fragile',
		type: String,
		nullable: true,
	})
	note?: string;

	@ApiProperty({
		description: 'Parcel image URL',
		example: 'https://example.com/image.jpg',
		type: String,
		nullable: true,
	})
	imageUrl?: string;

	@ApiProperty({
		description: 'Parcel status',
		enum: ['PENDING', 'PICKED_UP', 'RETURNED'],
		example: 'PENDING',
		type: String,
	})
	status: string;

	@ApiProperty({
		description: 'Courier service name',
		example: 'DHL',
		type: String,
	})
	courier: string;

	@ApiProperty({
		description: 'Creation timestamp',
		example: '2026-01-15T10:30:00Z',
		type: String,
	})
	createdAt: string;

	@ApiProperty({
		description: 'Pickup timestamp',
		example: '2026-01-15T12:00:00Z',
		type: String,
		nullable: true,
	})
	pickedUpAt?: string;

	@ApiProperty({
		description: 'Return timestamp',
		example: '2026-01-15T14:00:00Z',
		type: String,
		nullable: true,
	})
	returnedAt?: string;
}

export class ParcelListMetaDto {
	@ApiProperty({
		description: 'Total number of parcels',
		example: 50,
		type: Number,
	})
	total: number;

	@ApiProperty({
		description: 'Current page limit',
		example: 10,
		type: Number,
	})
	limit: number;

	@ApiProperty({
		description: 'Cursor for next page',
		example: 'next_cursor_string',
		type: String,
		nullable: true,
	})
	cursor?: string;
}

export class ParcelListResponseDto {
	@ApiProperty({
		description: 'Array of parcels',
		type: [ParcelResponseDto],
	})
	data: ParcelResponseDto[];

	@ApiProperty({
		description: 'Pagination metadata',
		type: ParcelListMetaDto,
	})
	meta: ParcelListMetaDto;
}

export class DeleteParcelResponseDto {
	@ApiProperty({
		description: 'Deletion success indicator',
		example: true,
		type: Boolean,
	})
	success: boolean;

	@ApiProperty({
		description: 'Deletion confirmation message',
		example: 'Parcel deleted successfully',
		type: String,
	})
	message: string;

	@ApiProperty({
		description: 'ID of deleted parcel',
		example: 'parcel-id-123',
		type: String,
	})
	id: string;
}
