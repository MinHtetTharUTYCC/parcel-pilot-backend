import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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

  @ApiPropertyOptional({
    description: "User's phone number",
    example: "+1234567890",
    type: String,
  })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class ProfileImageDto {
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  image: any;
}

