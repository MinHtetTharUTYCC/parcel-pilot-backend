import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class StaffFilterDto extends PaginationDto {
    @ApiPropertyOptional({
        description:
            "Search query for filtering staff by staff ID, name, or email",
        type: String,
        example: "John",
    })
    @IsOptional()
    @IsString()
    q?: string;
}
