import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateParcelDto {
  @ApiProperty({
    description: "ID of the recipient (resident) who will receive the parcel",
    type: String,
    example: "resident-id-123",
  })
  @IsString()
  recipientId: string;

  @ApiPropertyOptional({
    description: "Order ID from courier or e-commerce platform",
    type: String,
    example: "ORD-2026-001",
  })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({
    description: "Description of the parcel contents",
    type: String,
    example: "Electronics - Headphones",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: "Additional notes about the parcel",
    type: String,
    example: "Handle with care - fragile items",
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: "Name of the courier service",
    type: String,
    example: "DHL",
  })
  @IsString()
  @IsOptional()
  courier?: string;
}

export class ParcelImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any; // The key 'image' must match FileInterceptor("image")
}
