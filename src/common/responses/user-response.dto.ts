import { ApiProperty } from '@nestjs/swagger';

export class ResidentResponseDto {
	@ApiProperty({
		description: 'Resident user ID',
		example: 'resident-id-123',
		type: String,
	})
	id: string;

	@ApiProperty({
		description: 'Resident email',
		example: 'resident@example.com',
		type: String,
	})
	email: string;

	@ApiProperty({
		description: 'Resident name',
		example: 'John Doe',
		type: String,
	})
	name: string;

	@ApiProperty({
		description: 'Unit number',
		example: 'A-101',
		type: String,
	})
	unitNumber: string;

	@ApiProperty({
		description: 'Phone number',
		example: '+1234567890',
		type: String,
		nullable: true,
	})
	phone?: string;

	@ApiProperty({
		description: 'Approval status',
		enum: ['PENDING', 'APPROVED', 'REJECTED'],
		example: 'APPROVED',
		type: String,
	})
	status: string;

	@ApiProperty({
		description: 'User role',
		example: 'RESIDENT',
		type: String,
	})
	role: string;

	@ApiProperty({
		description: 'Rejection timestamp',
		example: '2026-01-15T10:00:00Z',
		type: String,
		nullable: true,
	})
	rejectedAt?: string;
}

export class StaffResponseDto {
	@ApiProperty({
		description: 'Staff user ID',
		example: 'staff-id-123',
		type: String,
	})
	id: string;

	@ApiProperty({
		description: 'Staff email',
		example: 'staff@example.com',
		type: String,
	})
	email: string;

	@ApiProperty({
		description: 'Staff name',
		example: 'Admin User',
		type: String,
	})
	name: string;

	@ApiProperty({
		description: 'User role',
		enum: ['STAFF', 'MANAGER'],
		example: 'STAFF',
		type: String,
	})
	role: string;

	@ApiProperty({
		description: 'Approval status',
		enum: ['PENDING', 'APPROVED', 'REJECTED'],
		example: 'APPROVED',
		type: String,
	})
	status: string;
}

export class ResidentListMetaDto {
	@ApiProperty({
		description: 'Total number of residents',
		example: 25,
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

export class ResidentListResponseDto {
	@ApiProperty({
		description: 'Array of residents',
		type: [ResidentResponseDto],
	})
	data: ResidentResponseDto[];

	@ApiProperty({
		description: 'Pagination metadata',
		type: ResidentListMetaDto,
	})
	meta: ResidentListMetaDto;
}

export class StaffListResponseDto {
	@ApiProperty({
		description: 'Array of staff members',
		type: [StaffResponseDto],
	})
	data: StaffResponseDto[];

	@ApiProperty({
		description: 'Pagination metadata',
		type: ResidentListMetaDto,
	})
	meta: ResidentListMetaDto;
}
