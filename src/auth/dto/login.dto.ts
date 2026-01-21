import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
	@ApiProperty({
		description: 'User email address',
		example: 'user@example.com',
		type: String,
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

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
