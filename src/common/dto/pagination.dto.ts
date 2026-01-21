import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
	@ApiPropertyOptional({
		description: 'Cursor for pagination - retrieve records after this cursor',
		type: String,
		example: 'cursor_string_here',
	})
	@IsOptional()
	@IsString()
	readonly cursor?: string;

	@ApiPropertyOptional({
		description: 'Number of records to retrieve per page',
		type: Number,
		default: 10,
		example: 10,
	})
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	readonly limit?: number = 10;
}
