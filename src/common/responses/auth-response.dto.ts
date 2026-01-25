import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";


export class UserResponseDto {
  @ApiProperty({
    description: "User ID",
    example: "user-id-123",
    type: String,
  })
  id: string;

  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
    type: String,
  })
  email: string;

  @ApiProperty({
    description: "User full name",
    example: "John Doe",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "User role - RESIDENT, STAFF, or MANAGER",
    enum: UserRole,
    example: "RESIDENT",
    type: String,
  })
  role: UserRole;
  
  @ApiProperty({
    description: "User profile image url",
    example: "https://s2/img1.jpg",
    type: String,
  })
  imageUrl: string | null;
}

export class LoginResponseDto {
  @ApiProperty({
    description: "JWT access token for authentication",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    type: String,
  })
  access_token: string;

  @ApiProperty({
    description: "Token type",
    example: "Bearer",
    type: String,
  })
  token_type: string;

  @ApiProperty({
    description: "Authenticated user information",
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
export class SignupResponseDto {
  @ApiProperty({
    description: "Signup success indicator",
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: "Signup success message",
    example: "Signed up successfully. Wait for approval",
    type: String,
  })
  message: string;
}

export class LogoutResponseDto {
  @ApiProperty({
    description: "Logout success indicator",
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: "Logout message",
    example: "Logged out successfully",
    type: String,
  })
  message: string;
}
