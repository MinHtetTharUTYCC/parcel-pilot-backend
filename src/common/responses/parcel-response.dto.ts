import { ApiProperty } from "@nestjs/swagger";

// Base DTO for recipient information (limited view for residents)
export class ParcelRecipientDto {
  @ApiProperty({
    description: "Recipient user ID",
    example: "resident-id-123",
    type: String,
  })
  id: string;

  @ApiProperty({
    description: "Recipient name",
    example: "John Doe",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "Recipient email",
    example: "john@example.com",
    type: String,
  })
  email: string;

  @ApiProperty({
    description: "Recipient unit number",
    example: "A-101",
    type: String,
  })
  unitNumber: string;

  @ApiProperty({
    description: "Recipient phone number",
    example: "+1234567890",
    type: String,
    nullable: true,
  })
  phone?: string;
}

// Staff/Manager info DTO
export class ParcelStaffDto {
  @ApiProperty({
    description: "Staff name",
    example: "Jane Admin",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "Staff email",
    example: "staff@example.com",
    type: String,
  })
  email: string;
}

// Base parcel response (for residents - minimal information)
export class ParcelResponseDto {
  @ApiProperty({
    description: "Parcel ID",
    example: "parcel-id-123",
    type: String,
  })
  id: string;

  @ApiProperty({
    description: "Order ID from courier",
    example: "ORD-2026-001",
    type: String,
    nullable: true,
  })
  orderId?: string;

  @ApiProperty({
    description: "Recipient ID",
    example: "resident-id-123",
    type: String,
  })
  recipientId: string;

  @ApiProperty({
    description: "Recipient information",
    type: ParcelRecipientDto,
    nullable: true,
  })
  recipient?: ParcelRecipientDto;

  @ApiProperty({
    description: "Parcel description",
    example: "Electronics - Headphones",
    type: String,
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: "Additional notes",
    example: "Handle with care - fragile",
    type: String,
    nullable: true,
  })
  note?: string;

  @ApiProperty({
    description: "Parcel image URL",
    example: "https://example.com/image.jpg",
    type: String,
    nullable: true,
  })
  imageUrl?: string;

  @ApiProperty({
    description: "Parcel status",
    enum: ["REGISTERED", "READY_FOR_PICKUP", "PICKED_UP", "RETURNED"],
    example: "REGISTERED",
    type: String,
  })
  status: string;

  @ApiProperty({
    description: "Courier service name",
    example: "DHL",
    type: String,
  })
  courier: string;

  @ApiProperty({
    description: "Pickup code for confirmation",
    example: "pickup-code-xyz",
    type: String,
  })
  pickupCode: string;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2026-01-15T10:30:00Z",
    type: String,
  })
  registeredAt: string;

  @ApiProperty({
    description: "Pickup timestamp",
    example: "2026-01-15T12:00:00Z",
    type: String,
    nullable: true,
  })
  pickedUpAt?: string;

  @ApiProperty({
    description: "Return timestamp",
    example: "2026-01-15T14:00:00Z",
    type: String,
    nullable: true,
  })
  returnedAt?: string;
}

// Extended response for Staff/Manager (includes receivedBy information)
export class ParcelStaffResponseDto extends ParcelResponseDto {
  @ApiProperty({
    description: "Staff member who registered the parcel",
    type: ParcelStaffDto,
    nullable: true,
  })
  receivedBy?: ParcelStaffDto;
}

// Staff and Manager see additional info, Residents see basic info
export type ParcelResponseForRole = ParcelResponseDto | ParcelStaffResponseDto;

export class ParcelListMetaDto {
  @ApiProperty({
    description: "Total number of parcels",
    example: 50,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: "Current page limit",
    example: 10,
    type: Number,
  })
  limit: number;

  @ApiProperty({
    description: "Current page number",
    example: 1,
    type: Number,
  })
  page?: number;

  @ApiProperty({
    description: "Total number of pages",
    example: 5,
    type: Number,
  })
  totalPages: number;

  @ApiProperty({
    description: "Indicator if there is a next page",
    example: true,
    type: Boolean,
  })
  hasNext: boolean;
}

// Base list response (for residents)
export class ParcelListResponseDto {
  @ApiProperty({
    description: "Array of parcels",
    type: ParcelResponseDto,
    isArray: true,
  })
  data: ParcelResponseDto[];

  @ApiProperty({
    description: "Pagination metadata",
    type: ParcelListMetaDto,
  })
  meta: ParcelListMetaDto;
}

// Extended list response for Staff/Manager
export class ParcelStaffListResponseDto {
  @ApiProperty({
    description: "Array of parcels with staff information",
    type: ParcelStaffResponseDto,
    isArray: true,
  })
  data: ParcelStaffResponseDto[];

  @ApiProperty({
    description: "Pagination metadata",
    type: ParcelListMetaDto,
  })
  meta: ParcelListMetaDto;
}

export class DeleteParcelResponseDto {
  @ApiProperty({
    description: "Deletion confirmation message",
    example: "Parcel deleted successfully",
    type: String,
  })
  message: string;

  @ApiProperty({
    description: "ID of deleted parcel",
    example: "parcel-id-123",
    type: String,
  })
  parcelId: string;
}

export class PickupParcelResponseDto {
  @ApiProperty({
    description: "Pickup confirmation message",
    example: "Parcel picked up successfully",
    type: String,
  })
  message: string;

  @ApiProperty({
    description: "ID of picked up parcel",
    example: "parcel-id-123",
    type: String,
  })
  parcelId: string;
}

export class ParcelReturnResponseDto {
  @ApiProperty({
    description: "Parcel returned confirmation message",
    example: "Parcel returned successfully",
    type: String,
  })
  message: string;

  @ApiProperty({
    description: "ID of returned parcel",
    example: "parcel-id-123",
    type: String,
  })
  parcelId: string;
}

