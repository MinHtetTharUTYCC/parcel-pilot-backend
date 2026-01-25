import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { createApiResponseDto } from "src/shared/types/responses/api-response.dto";

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
    example: "https://example.com/images/john-doe.jpg",
    type: String,
    nullable: true,
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


// Auto-generated API Response DTOs - no repetition!
export const GetMeApiResponseDto = createApiResponseDto(UserResponseDto);
export const LoginApiResponseDto = createApiResponseDto(LoginResponseDto);

// For endpoints that return simple strings, the interceptor wraps them automatically
// We just need to tell OpenAPI what the wrapped response looks like
export class StringResponseDto {
  @ApiProperty({
    description: "Response message",
    example: "Operation successful",
    type: String,
  })
  message: string;
}

export class LogoutMessageDto {
  @ApiProperty({
    description: "Logout confirmation message",
    example: "Logged out successfully",
    type: String,
  })
  message: string;
}

export class SignupMessageDto {
  @ApiProperty({
    description: "Signup confirmation message",
    example: "Created account successfully. Wait for approval",
    type: String,
  })
  message: string;
}

export const LogoutApiResponseDto = createApiResponseDto(LogoutMessageDto);
export const SignupApiResponseDto = createApiResponseDto(SignupMessageDto);
