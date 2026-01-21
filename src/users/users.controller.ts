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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ResidentFilterDto } from './dto/resident-filter.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
	ApiTags,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateStaffDto } from './dto/create-staff.dto';
import { ReqUser } from 'src/auth/decorators/req-user.decorator';
import { RequestUser } from 'src/auth/interfaces/auth.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseInterceptors(SuccessResponseInterceptor)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('me')
	@Auth('MANAGER', 'STAFF', 'RESIDENT')
	getMe(@ReqUser() user: RequestUser) {
		return this.usersService.getMe(user.sub);
	}

	@Patch('update')
	@Auth('MANAGER', 'STAFF', 'RESIDENT')
	@UseInterceptors(FileInterceptor('image'))
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
	) {
		return this.usersService.updateProfile(user.sub, file, dto);
	}

	@Patch('update/unit')
	@Auth('MANAGER', 'STAFF')
	updateUnit(@Body() dto: UpdateUnitDto) {
		return this.usersService.updateUnit(dto);
	}

	@Patch(':id/approve')
	@Auth('STAFF', 'MANAGER')
	@ApiOperation({
		summary: 'Approve a Resident',
		description:
			'Approve a pending resident registration. Only STAFF and MANAGER roles can perform this action.',
	})
	@ApiParam({
		name: 'id',
		type: String,
		description: 'The unique ID of the resident to approve',
		example: 'user-id-123',
	})
	@ApiResponse({
		status: 200,
		description: 'Resident approved successfully',
		schema: {
			example: {
				id: 'user-id-123',
				email: 'resident@example.com',
				name: 'John Doe',
				status: 'APPROVED',
				role: 'RESIDENT',
			},
		},
	})
	@ApiResponse({
		status: 404,
		description: 'Resident not found',
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden - insufficient permissions',
	})
	approveResident(@Param('id') id: string) {
		return this.usersService.approveResident(id);
	}

	@Patch(':id/reject')
	@Auth('STAFF', 'MANAGER')
	@ApiOperation({
		summary: 'Reject a Resident',
		description:
			'Reject a pending resident registration. Only STAFF and MANAGER roles can perform this action.',
	})
	@ApiParam({
		name: 'id',
		type: String,
		description: 'The unique ID of the resident to reject',
		example: 'user-id-123',
	})
	@ApiResponse({
		status: 200,
		description: 'Resident rejected successfully',
		schema: {
			example: {
				id: 'user-id-123',
				email: 'resident@example.com',
				name: 'John Doe',
				status: 'REJECTED',
				role: 'RESIDENT',
				rejectedAt: '2026-01-15T10:30:00Z',
			},
		},
	})
	@ApiResponse({
		status: 404,
		description: 'Resident not found',
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden - insufficient permissions',
	})
	rejectResident(@Param('id') id: string) {
		return this.usersService.rejectResident(id);
	}

	@Get('residents')
	@Auth('STAFF', 'MANAGER')
	@ApiOperation({
		summary: 'Get Residents List',
		description:
			'Retrieve a list of residents with optional filtering by approval status. Only STAFF and MANAGER roles can access this.',
	})
	@ApiQuery({
		type: ResidentFilterDto,
		description: 'Filter and pagination options for residents',
	})
	@ApiResponse({
		status: 200,
		description: 'List of residents retrieved successfully',
		schema: {
			example: {
				data: [
					{
						id: 'user-id-1',
						email: 'resident1@example.com',
						name: 'John Doe',
						unitNumber: 'A-101',
						status: 'APPROVED',
						role: 'RESIDENT',
					},
					{
						id: 'user-id-2',
						email: 'resident2@example.com',
						name: 'Jane Smith',
						unitNumber: 'A-102',
						status: 'PENDING',
						role: 'RESIDENT',
					},
				],
				meta: {
					total: 25,
					limit: 10,
					cursor: 'next_cursor_string',
				},
			},
		},
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden - insufficient permissions',
	})
	getResidents(@Query() dto: ResidentFilterDto) {
		return this.usersService.getResidents(dto);
	}

	@Get('staffs')
	@Auth('MANAGER')
	@ApiOperation({
		summary: 'Get Staff List',
		description:
			'Retrieve a list of staff members. Only MANAGER role can access this',
	})
	@ApiQuery({
		type: PaginationDto,
		description: 'Pagination options for staff list',
	})
	@ApiResponse({
		status: 200,
		description: 'List of staff members retrieved successfully',
		schema: {
			example: {
				data: [
					{
						id: 'staff-id-1',
						email: 'staff1@example.com',
						name: 'Admin User',
						role: 'STAFF',
						status: 'APPROVED',
					},
					{
						id: 'staff-id-2',
						email: 'staff2@example.com',
						name: 'Manager User',
						role: 'MANAGER',
						status: 'APPROVED',
					},
				],
				meta: {
					total: 5,
					limit: 10,
					cursor: 'next_cursor_string',
				},
			},
		},
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden - only MANAGER role can access',
	})
	getStaffs(@Query() dto: PaginationDto) {
		return this.usersService.getStaffs(dto);
	}

	@Post('staffs')
	@Auth('MANAGER')
	createStaff(@Body() dto: CreateStaffDto) {
		return this.usersService.createStaff(dto);
	}
}
