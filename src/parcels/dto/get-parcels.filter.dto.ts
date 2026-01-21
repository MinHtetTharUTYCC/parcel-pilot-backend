import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetParcelsFilterDto extends PaginationDto {
	@ApiPropertyOptional({
		description:
			'Search query for filtering parcels by order ID, recipient name, or description',
		type: String,
		example: 'John',
	})
	@IsOptional()
	@IsString()
	q?: string;
}
