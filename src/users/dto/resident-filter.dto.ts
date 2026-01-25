import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ResidentFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description:
      "Search query for filtering resident by resident ID, name, or unit number",
    type: String,
    example: "John",
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: "Filter by resident approval status",
    enum: ["RESIDENT_PENDING", "RESIDENT_REJECTED"],
    example: "RESIDENT_REJECTED",
    type: String,
  })
  @IsOptional()
  @IsEnum(["RESIDENT_PENDING", "RESIDENT_REJECTED"])
  readonly role?: "RESIDENT_PENDING" | "RESIDENT_REJECTED";
}
