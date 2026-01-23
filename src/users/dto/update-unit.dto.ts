import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUnitDto {
  @ApiProperty({
    description: "Resident user ID",
    example: "resident-id-123",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  residentId: string;

  @ApiProperty({
    description: "New unit/apartment number",
    example: "B-205",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  unitNumber: string;
}
