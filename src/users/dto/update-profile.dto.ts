import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: "User's full name",
    example: "John Doe",
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
