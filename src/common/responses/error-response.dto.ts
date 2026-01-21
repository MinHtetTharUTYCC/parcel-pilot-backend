import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
	@ApiProperty({
		description: 'HTTP status code',
		example: 400,
		type: Number,
	})
	statusCode: number;

	@ApiProperty({
		description: 'Error message or validation errors',
		example: 'Invalid request body',
		type: String,
	})
	message: string;

	@ApiProperty({
		description: 'Error timestamp',
		example: '2026-01-15T10:30:00.000Z',
		type: String,
	})
	timestamp: string;

	@ApiProperty({
		description: 'Request path',
		example: '/api/parcels',
		type: String,
	})
	path: string;
}

export class ValidationErrorResponseDto {
	@ApiProperty({
		description: 'HTTP status code',
		example: 400,
		type: Number,
	})
	statusCode: number;

	@ApiProperty({
		description: 'Field validation errors',
		example: {
			email: ['email must be an email'],
			password: ['password must be longer than or equal to 6 characters'],
		},
		type: Object,
		additionalProperties: true,
	})
	message: object;

	@ApiProperty({
		description: 'Error timestamp',
		example: '2026-01-15T10:30:00.000Z',
		type: String,
	})
	timestamp: string;

	@ApiProperty({
		description: 'Request path',
		example: '/api/auth/login',
		type: String,
	})
	path: string;
}

export class NotFoundResponseDto {
	@ApiProperty({
		description: 'HTTP status code',
		example: 404,
		type: Number,
	})
	statusCode: number;

	@ApiProperty({
		description: 'Not found error message',
		example: 'Parcel not found',
		type: String,
	})
	message: string;

	@ApiProperty({
		description: 'Error timestamp',
		example: '2026-01-15T10:30:00.000Z',
		type: String,
	})
	timestamp: string;

	@ApiProperty({
		description: 'Request path',
		example: '/api/parcels/123',
		type: String,
	})
	path: string;
}

export class UnauthorizedResponseDto {
	@ApiProperty({
		description: 'HTTP status code',
		example: 401,
		type: Number,
	})
	statusCode: number;

	@ApiProperty({
		description: 'Unauthorized error message',
		example: 'Unauthorized',
		type: String,
	})
	message: string;

	@ApiProperty({
		description: 'Error timestamp',
		example: '2026-01-15T10:30:00.000Z',
		type: String,
	})
	timestamp: string;

	@ApiProperty({
		description: 'Request path',
		example: '/api/parcels',
		type: String,
	})
	path: string;
}

export class ForbiddenResponseDto {
	@ApiProperty({
		description: 'HTTP status code',
		example: 403,
		type: Number,
	})
	statusCode: number;

	@ApiProperty({
		description: 'Forbidden error message',
		example: 'Insufficient permissions',
		type: String,
	})
	message: string;

	@ApiProperty({
		description: 'Error timestamp',
		example: '2026-01-15T10:30:00.000Z',
		type: String,
	})
	timestamp: string;

	@ApiProperty({
		description: 'Request path',
		example: '/api/parcels',
		type: String,
	})
	path: string;
}
