import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PaginationDto {
  @ApiPropertyOptional({
    description: "Current page number for pagination",
    type: Number,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly page?: number;

  @ApiPropertyOptional({
    description: "Number of records to retrieve per page",
    type: Number,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly limit?: number = 10;
}
