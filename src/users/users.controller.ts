import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { SuccessResponseInterceptor } from "src/common/interceptors/success-response.interceptor";
import { Auth } from "src/auth/decorators/auth.decorator";
import { ResidentFilterDto } from "./dto/resident-filter.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
  IntersectionType,
  ApiConsumes,
} from "@nestjs/swagger";
import { CreateStaffDto } from "./dto/create-staff.dto";
import { ReqUser } from "src/auth/decorators/req-user.decorator";
import { RequestUser } from "src/auth/interfaces/auth.interface";
import { ProfileImageDto, UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateUnitDto } from "./dto/update-unit.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ResidentResponseDto,
  StaffResponseDto,
  ResidentListResponseDto,
  StaffListResponseDto,
  ResidentRejectResponseDto,
  UpdateUnitResponseDto,
  ResidentApprovedResponseDto,
  UpdateProfileResponseDto,
} from "src/common/responses/user-response.dto";
import { UserResponseDto } from "src/common/responses/auth-response.dto";
import {
  UnauthorizedResponseDto,
  ValidationErrorResponseDto,
  NotFoundResponseDto,
  ForbiddenResponseDto,
} from "src/common/responses/error-response.dto";
import { StaffFilterDto } from "./dto/staff-filter.dto";

@ApiTags("Users")
@ApiBearerAuth("access-token")
@Controller("users")
@UseInterceptors(SuccessResponseInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get("me")
  @Auth("MANAGER", "STAFF", "RESIDENT")
  @ApiOperation({
    summary: "Get Current User Profile",
    description:
      "Retrieve the profile information of the currently authenticated user.",
  })
  @ApiResponse({
    status: 200,
    description: "User profile retrieved successfully",
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - no valid token provided",
    type: UnauthorizedResponseDto,
  })
  getMe(@ReqUser() user: RequestUser) {
    return this.usersService.getMe(user.sub);
  }

  @Patch("update")
  @ApiConsumes("multipart/form-data")
  @Auth("MANAGER", "STAFF", "RESIDENT")
  @UseInterceptors(FileInterceptor("image"))
  @ApiOperation({
    summary: "Update User Profile",
    description:
      "Update the profile information of the currently authenticated user. Can optionally upload a profile image.",
  })
  @ApiResponse({
    status: 200,
    description: "Profile updated successfully",
    type: IntersectionType(UpdateProfileResponseDto, ProfileImageDto),
  })
  @ApiResponse({
    status: 400,
    description: "Validation error - invalid input or file type",
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - no valid token provided",
    type: UnauthorizedResponseDto,
  })
  updateProfile(
    @ReqUser() user: RequestUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Body() dto: UpdateProfileDto,
  ): Promise<UpdateProfileResponseDto> {
    return this.usersService.updateProfile(user.sub, file, dto);
  }

  @Patch("update/unit")
  @Auth("MANAGER", "STAFF")
  @ApiOperation({
    summary: "Update Resident Unit Number",
    description:
      "Update the unit number for a specific resident. Only STAFF and MANAGER roles can perform this action.",
  })
  @ApiResponse({
    status: 200,
    description: "Unit number updated successfully",
    type: UpdateUnitResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Resident not found",
    type: NotFoundResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
    type: ForbiddenResponseDto,
  })
  updateUnit(@Body() dto: UpdateUnitDto): Promise<UpdateUnitResponseDto> {
    return this.usersService.updateUnit(dto);
  }

  @Patch(":id/approve")
  @Auth("STAFF", "MANAGER")
  @ApiOperation({
    summary: "Approve a Resident",
    description:
      "Approve a pending resident registration. Only STAFF and MANAGER roles can perform this action.",
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "The unique ID of the resident to approve",
    example: "user-id-123",
  })
  @ApiResponse({
    status: 200,
    description: "Resident approved successfully",
    type: ResidentApprovedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Resident not found",
    type: NotFoundResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
    type: ForbiddenResponseDto,
  })
  approveResident(@Param("id") id: string): Promise<ResidentApprovedResponseDto> {
    return this.usersService.approveResident(id);
  }

  @Patch(":id/reject")
  @Auth("STAFF", "MANAGER")
  @ApiOperation({
    summary: "Reject a Resident",
    description:
      "Reject a pending resident registration. Only STAFF and MANAGER roles can perform this action.",
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "The unique ID of the resident to reject",
    example: "user-id-123",
  })
  @ApiResponse({
    status: 200,
    description: "Resident rejected successfully",
    type: ResidentRejectResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Resident not found",
    type: NotFoundResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
    type: ForbiddenResponseDto,
  })
  rejectResident(@Param("id") id: string): Promise<ResidentRejectResponseDto> {
    return this.usersService.rejectResident(id);
  }

  @Get("residents")
  @Auth("STAFF", "MANAGER")
  @ApiOperation({
    summary: "Get Residents List",
    description:
      "Retrieve a list of residents with optional filtering by approval status. Only STAFF and MANAGER roles can access this.",
  })
  @ApiQuery({
    type: ResidentFilterDto,
    description: "Filter and pagination options for residents",
  })
  @ApiResponse({
    status: 200,
    description: "List of residents retrieved successfully",
    type: ResidentListResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
    type: ForbiddenResponseDto,
  })
  getResidents(@Query() dto: ResidentFilterDto): Promise<ResidentListResponseDto> {
    return this.usersService.getResidents(dto);
  }

  @Get("staffs")
  @Auth("MANAGER")
  @ApiOperation({
    summary: "Get Staff List",
    description:
      "Retrieve a list of staff members. Only MANAGER role can access this",
  })
  @ApiQuery({
    type: StaffFilterDto,
    description: "Filter and pagination options for staff list",
  })
  @ApiResponse({
    status: 200,
    description: "List of staff members retrieved successfully",
    type: StaffListResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - only MANAGER role can access",
    type: ForbiddenResponseDto,
  })
  getStaffs(@Query() dto: StaffFilterDto): Promise<StaffListResponseDto> {
    return this.usersService.getStaffs(dto);
  }

  @Post("staffs")
  @Auth("MANAGER")
  @ApiOperation({
    summary: "Create New Staff Member",
    description:
      "Create a new staff or manager user. Only MANAGER role can perform this action.",
  })
  @ApiResponse({
    status: 201,
    description: "Staff member created successfully",
    type: StaffResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Validation error - invalid input or email already exists",
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - only MANAGER role can create staff",
    type: ForbiddenResponseDto,
  })
  createStaff(@Body() dto: CreateStaffDto): Promise<StaffResponseDto> {
    return this.usersService.createStaff(dto);
  }
}
