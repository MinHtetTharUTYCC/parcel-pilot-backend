import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
	@ApiProperty({
		description: 'User ID',
		example: 'user-id-123',
		type: String,
	})
	id: string;

	@ApiProperty({
		description: 'User email address',
		example: 'user@example.com',
		type: String,
	})
	email: string;

	@ApiProperty({
		description: 'User full name',
		example: 'John Doe',
		type: String,
	})
	name: string;

	@ApiProperty({
		description: 'Unit/Apartment number for residents',
		example: 'A-101',
		type: String,
		nullable: true,
	})
	unitNumber?: string;

	@ApiProperty({
		description: 'User role - RESIDENT, STAFF, or MANAGER',
		enum: ['RESIDENT', 'STAFF', 'MANAGER'],
		example: 'RESIDENT',
		type: String,
	})
	role: string;

	@ApiProperty({
		description: 'User approval status - PENDING, APPROVED, or REJECTED',
		enum: ['PENDING', 'APPROVED', 'REJECTED'],
		example: 'APPROVED',
		type: String,
	})
	status: string;
}

export class LoginResponseDto {
	@ApiProperty({
		description: 'JWT access token for authentication',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
		type: String,
	})
	access_token: string;

	@ApiProperty({
		description: 'Token type',
		example: 'Bearer',
		type: String,
	})
	token_type: string;

	@ApiProperty({
		description: 'Authenticated user information',
		type: UserResponseDto,
	})
	user: UserResponseDto;
}

export class SignupResponseDto {
	@ApiProperty({
		description: 'New user ID',
		example: 'user-id-new',
		type: String,
	})
	id: string;

	@ApiProperty({
		description: 'User email',
		example: 'newuser@example.com',
		type: String,
	})
	email: string;

	@ApiProperty({
		description: 'User name',
		example: 'Jane Smith',
		type: String,
	})
	name: string;

	@ApiProperty({
		description: 'Unit number',
		example: 'B-205',
		type: String,
	})
	unitNumber: string;

	@ApiProperty({
		description: 'User role',
		enum: ['RESIDENT', 'STAFF', 'MANAGER'],
		example: 'RESIDENT',
		type: String,
	})
	role: string;

	@ApiProperty({
		description: 'Initial status (usually PENDING for new registrations)',
		enum: ['PENDING', 'APPROVED', 'REJECTED'],
		example: 'PENDING',
		type: String,
	})
	status: string;

	@ApiProperty({
		description: 'Account creation timestamp',
		example: '2026-01-15T10:30:00Z',
		type: String,
	})
	createdAt: string;
}

export class LogoutResponseDto {
	@ApiProperty({
		description: 'Logout success indicator',
		example: true,
		type: Boolean,
	})
	success: boolean;

	@ApiProperty({
		description: 'Logout message',
		example: 'Logged out successfully',
		type: String,
	})
	message: string;
}
