import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ResidentFilterDto extends PaginationDto {
	@ApiPropertyOptional({
		description:
			'Filter residents by approval status - true for pending residents, false for approved residents',
		type: Boolean,
		example: true,
	})
	@IsOptional()
	@Transform(({ value }) => {
		if (value === undefined || value === null) return undefined;
		if (typeof value === 'boolean') return value;
		return String(value).toLowerCase() === 'true';
	})
	@IsBoolean()
	readonly pending?: boolean;
}
