import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
	@ApiProperty({
		description: 'User email address',
		example: 'user@example.com',
		type: String,
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: 'User full name',
		example: 'John Doe',
		type: String,
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'Unit/Apartment number of the resident',
		example: 'A-101',
		type: String,
	})
	@IsNotEmpty()
	@IsString()
	unitNumber: string;

	@ApiProperty({
		description: 'User contact phone number (optional)',
		example: '+1234567890',
		type: String,
		required: false,
	})
	@IsOptional()
	@IsString()
	phone: string;

	@ApiProperty({
		description: 'User password (minimum 6 characters, maximum 30 characters)',
		example: 'Password@123',
		minLength: 6,
		maxLength: 30,
		type: String,
	})
	@IsString()
	@MinLength(6)
	@MaxLength(30)
	password: string;
}
