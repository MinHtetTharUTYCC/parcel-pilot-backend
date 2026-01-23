import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateStaffDto {
  @ApiProperty({
    description: "Staff member's full name",
    example: "Jane Admin",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Staff member's email address",
    example: "staff@example.com",
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Staff member's password (minimum 6 characters, maximum 30 characters)",
    example: "Password@123",
    minLength: 6,
    maxLength: 30,
    type: String,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsNotEmpty()
  password: string;
}
