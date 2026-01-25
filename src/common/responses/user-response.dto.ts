import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

export class ResidentResponseDto {
  @ApiProperty({
    description: "Resident user ID",
    example: "resident-id-123",
    type: String,
  })
  id: string;

  @ApiProperty({
    description: "Resident email",
    example: "resident@example.com",
    type: String,
  })
  email: string;

  @ApiProperty({
    description: "Resident name",
    example: "John Doe",
    type: String,
  })
  name: string;


  @ApiProperty({
    description: "Phone number",
    example: "+1234567890",
    type: String,
    nullable: true,
  })
  phone?: string;

  @ApiProperty({
    description: "Unit number",
    example: "A-101",
    type: String,
  })
  unitNumber: string;

  @ApiProperty({
    description: "User role",
    example: UserRole.RESIDENT_PENDING,
    enum: UserRole,
    type: String,
  })
  role: UserRole;

  @ApiProperty({
    description: "profile image URL",
    example: "https://example.com/images/jane-smith.jpg",
    type: String,
    nullable: true,
  })
  imageUrl?: string;

  @ApiProperty({
    description: "Rejection timestamp",
    example: "2026-01-15T10:00:00Z",
    type: String,
    nullable: true,
  })
  rejectedAt?: string;

  @ApiProperty({
    description: "Approval timestamp",
    example: "2026-01-15T10:00:00Z",
    type: String,
    nullable: true,
  })
  approvedAt?: string;
}


export class StaffResponseDto {
  @ApiProperty({
    description: "Staff user ID",
    example: "staff-id-123",
    type: String,
  })
  id: string;

  @ApiProperty({
    description: "Staff email",
    example: "staff@example.com",
    type: String,
  })
  email: string;

  @ApiProperty({
    description: "Staff name",
    example: "Jane Smith",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "profile image URL",
    example: "https://example.com/images/jane-smith.jpg",
    type: String,
    nullable: true,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Number of parcels managed by the staff',
    example: 42,
    type: Number,
  })
  managedParcelsCount: number;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2026-01-10T09:30:00Z",
    type: String,
  })
  createdAt: string;

}

export class ResidentApprovedResponseDto {
  @ApiProperty({
    description: "Resident user ID",
    example: "resident-id-123",
    type: String,
  })
  residentId: string;

  @ApiProperty({
    description: "Approval message",
    example: "Resident application has been approved successfully.",
    type: String,
  })
  message: string;
}
export class ResidentRejectResponseDto {
  @ApiProperty({
    description: "Resident user ID",
    example: "resident-id-123",
    type: String,
  })
  residentId: string;

  @ApiProperty({
    description: "Rejection message",
    example: "Resident application has been rejected due to incomplete documents.",
    type: String,
  })
  message: string;
}

export class UpdateUnitResponseDto {
  @ApiProperty({
    description: "Resident user ID",
    example: "resident-id-123",
    type: String,
  })
  residentId: string;

  @ApiProperty({
    description: "Updated unit number",
    example: "A-101",
    type: String,
  })
  unitNumber: string;
}
export class UpdateProfileResponseDto {
  @ApiProperty({
    description: "User ID",
    example: "user-id-123",
    type: String,
  })
  id: string;

  @ApiProperty({
    description: "User name",
    example: "John Doe",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "Phone number",
    example: "+1234567890",
    type: String,
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({
    description: "Profile image URL",
    example: "https://example.com/images/john-doe.jpg",
    type: String,
    nullable: true,
  })
  imageUrl: string | null;
}

export class ResidentListMetaDto {
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

export class ResidentListResponseDto {
  @ApiProperty({
    description: "Array of residents",
    type: [ResidentResponseDto],
  })
  data: ResidentResponseDto[];

  @ApiProperty({
    description: "Pagination metadata",
    type: ResidentListMetaDto,
  })
  meta: ResidentListMetaDto;
}

export class StaffListResponseDto {
  @ApiProperty({
    description: "Array of staff members",
    type: [StaffResponseDto],
  })
  data: StaffResponseDto[];

  @ApiProperty({
    description: "Pagination metadata",
    type: ResidentListMetaDto,
  })
  meta: ResidentListMetaDto;
}
