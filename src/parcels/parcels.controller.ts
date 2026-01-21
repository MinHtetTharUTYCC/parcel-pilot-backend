import {
	Controller,
	Get,
	Post,
	Param,
	Body,
	UseInterceptors,
	Query,
	Patch,
	Delete,
	UploadedFile,
	ParseFilePipe,
	MaxFileSizeValidator,
	FileTypeValidator,
} from '@nestjs/common';
import { ParcelsService } from './parcels.service';
import { ReqUser } from 'src/auth/decorators/req-user.decorator';
import * as authInterfaces from 'src/auth/interfaces/auth.interface';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';
import { UpdateParcelDto } from './dto/update-parcel.dto';
import { GetParcelsFilterDto } from './dto/get-parcels.filter.dto';
import {
	ApiTags,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiBearerAuth,
	ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Parcels')
@ApiBearerAuth('access-token')
@Controller('parcels')
@UseInterceptors(SuccessResponseInterceptor)
export class ParcelsController {
	constructor(private readonly parcelsService: ParcelsService) {}

	@Get()
	@Auth('STAFF', 'MANAGER')
	@ApiOperation({
		summary: 'Get All Parcels',
		description:
			'Retrieve a list of all parcels in the system with optional search and pagination. Only STAFF and MANAGER roles can access this.',
	})
	@ApiQuery({
		type: GetParcelsFilterDto,
		description: 'Filter and pagination options for parcels',
	})
	@ApiResponse({
		status: 200,
		description: 'List of parcels retrieved successfully',
		schema: {
			example: {
				data: [
					{
						id: 'parcel-id-1',
						orderId: 'ORD-2026-001',
						recipientId: 'resident-id-1',
						recipient: {
							id: 'resident-id-1',
							name: 'John Doe',
							email: 'john@example.com',
							unitNumber: 'A-101',
						},
						description: 'Package contents',
						status: 'PENDING',
						courier: 'DHL',
						createdAt: '2026-01-15T10:30:00Z',
					},
				],
				meta: {
					total: 50,
					limit: 10,
					cursor: 'next_cursor',
				},
			},
		},
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden - insufficient permissions',
	})
	getAllParcels(
		@ReqUser() user: authInterfaces.RequestUser,
		@Query() dto: GetParcelsFilterDto,
	) {
		return this.parcelsService.getParcels(user, dto);
	}

	@Get('mine')
	@Auth('RESIDENT')
	@ApiOperation({
		summary: 'Get My Parcels',
		description:
			'Retrieve parcels for the logged-in resident. Only RESIDENT role can access this.',
	})
	@ApiQuery({
		type: GetParcelsFilterDto,
		description: 'Filter and pagination options for resident parcels',
	})
	@ApiResponse({
		status: 200,
		description: 'List of resident parcels retrieved successfully',
		schema: {
			example: {
				data: [
					{
						id: 'parcel-id-1',
						orderId: 'ORD-2026-001',
						recipientId: 'resident-id-1',
						description: 'Package contents',
						status: 'PENDING',
						courier: 'DHL',
						createdAt: '2026-01-15T10:30:00Z',
					},
				],
				meta: {
					total: 5,
					limit: 10,
					cursor: null,
				},
			},
		},
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden - insufficient permissions',
	})
	getMyParcels(
		@ReqUser() user: authInterfaces.RequestUser,
		@Query() dto: GetParcelsFilterDto,
	) {
		return this.parcelsService.getMyParcels(user.sub, dto);
	}

	@Get('/:id')
	@Auth('RESIDENT', 'STAFF', 'MANAGER')
	@ApiOperation({
		summary: 'Get Parcel Details',
		description:
			'Retrieve detailed information about a specific parcel. Residents can only view their own parcels.',
	})
	@ApiParam({
		name: 'id',
		type: String,
		description: 'The unique ID of the parcel',
		example: 'parcel-id-123',
	})
	@ApiResponse({
		status: 200,
		description: 'Parcel details retrieved successfully',
		schema: {
			example: {
				id: 'parcel-id-1',
				orderId: 'ORD-2026-001',
				recipientId: 'resident-id-1',
				recipient: {
					id: 'resident-id-1',
					name: 'John Doe',
					email: 'john@example.com',
					unitNumber: 'A-101',
					phone: '+1234567890',
				},
				description: 'Package contents',
				note: 'Handle with care',
				imageUrl: 'https://example.com/image.jpg',
				status: 'PENDING',
				courier: 'DHL',
				createdAt: '2026-01-15T10:30:00Z',
				pickedUpAt: null,
				returnedAt: null,
			},
		},
	})
	@ApiResponse({
		status: 404,
		description: 'Parcel not found',
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden - cannot view other residents parcels',
	})
	getParcel(
		@ReqUser() user: authInterfaces.RequestUser,
		@Param('id') id: string,
	) {
		return this.parcelsService.getParcel(user, id);
	}

	@Post()
	@UseInterceptors(FileInterceptor('image'))
	@Auth('STAFF', 'MANAGER')
	@ApiOperation({
		summary: 'Create New Parcel',
		description:
			'Create a new parcel entry in the system. Only STAFF and MANAGER roles can create parcels.',
	})
	@ApiBody({
		type: CreateParcelDto,
		description: 'Parcel creation details',
	})
	@ApiResponse({
		status: 201,
		description: 'Parcel created successfully',
		schema: {
			example: {
				id: 'parcel-id-new',
				orderId: 'ORD-2026-002',
				recipientId: 'resident-id-1',
				description: 'New package',
				status: 'PENDING',
				courier: 'FedEx',
				createdAt: '2026-01-15T11:45:00Z',
			},
		},
	})
	@ApiResponse({
		status: 400,
		description: 'Validation error - invalid input',
	})
	@ApiResponse({
		status: 404,
		description: 'Recipient not found',
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden - insufficient permissions',
	})
	createParcel(
		@Body() dto: CreateParcelDto,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
					new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
				],
				fileIsRequired: true,
			}),
		)
		file: Express.Multer.File,
		@ReqUser() user: authInterfaces.RequestUser,
	) {
		return this.parcelsService.createParcel(dto, file, user.sub);
	}

	@Patch('pickup/:id')
	@Auth('STAFF', 'MANAGER')
	@ApiOperation({
		summary: 'Mark Parcel as Picked Up',
		description:
			'Update parcel status to picked up by the resident. Only STAFF and MANAGER roles can perform this action.',
	})
	@ApiParam({
		name: 'id',
		type: String,
		description: 'The unique ID of the parcel',
		example: 'parcel-id-123',
	})
	@ApiResponse({
		status: 200,
		description: 'Parcel marked as picked up successfully',
		schema: {
			example: {
				id: 'parcel-id-1',
				status: 'PICKED_UP',
				pickedUpAt: '2026-01-15T12:00:00Z',
			},
		},
	})
	@ApiResponse({
		status: 404,
		description: 'Parcel not found',
	})
	@ApiResponse({
		status: 400,
		description: 'Parcel cannot be picked up - invalid status',
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden - insufficient permissions',
	})
	pickupParcel(@Param('id') id: string) {
		return this.parcelsService.pickupParcel(id);
	}

	@Patch('return/:id')
	@Auth('STAFF', 'MANAGER')
	@ApiOperation({
		summary: 'Mark Parcel as Returned',
		description:
			'Update parcel status to returned to sender. Only STAFF and MANAGER roles can perform this action.',
	})
	@ApiParam({
		name: 'id',
		type: String,
		description: 'The unique ID of the parcel',
		example: 'parcel-id-123',
	})
	@ApiResponse({
		status: 200,
		description: 'Parcel marked as returned successfully',
		schema: {
			example: {
				id: 'parcel-id-1',
				status: 'RETURNED',
				returnedAt: '2026-01-15T12:30:00Z',
			},
		},
	})
	@ApiResponse({
		status: 404,
		description: 'Parcel not found',
	})
	@ApiResponse({
		status: 400,
		description: 'Parcel cannot be returned - invalid status',
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden - insufficient permissions',
	})
	returnParcel(@Param('id') id: string) {
		return this.parcelsService.returnParcel(id);
	}

	@Patch(':id')
	@Auth('STAFF', 'MANAGER')
	@ApiOperation({
		summary: 'Update Parcel',
		description:
			'Update parcel information. Only STAFF and MANAGER roles can update parcels.',
	})
	@ApiParam({
		name: 'id',
		type: String,
		description: 'The unique ID of the parcel',
		example: 'parcel-id-123',
	})
	@ApiBody({
		type: UpdateParcelDto,
		description: 'Parcel fields to update (all fields optional)',
	})
	@ApiResponse({
		status: 200,
		description: 'Parcel updated successfully',
		schema: {
			example: {
				id: 'parcel-id-1',
				orderId: 'ORD-2026-001-UPDATED',
				description: 'Updated description',
				note: 'Updated notes',
				courier: 'DHL',
				updatedAt: '2026-01-15T13:00:00Z',
			},
		},
	})
	@ApiResponse({
		status: 404,
		description: 'Parcel not found',
	})
	@ApiResponse({
		status: 400,
		description: 'Validation error - invalid input',
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden - insufficient permissions',
	})
	updateParcel(@Param('id') id: string, @Body() dto: UpdateParcelDto) {
		return this.parcelsService.updateParcel(dto, id);
	}

	@Delete(':id')
	@Auth('STAFF', 'MANAGER')
	@ApiOperation({
		summary: 'Delete Parcel',
		description:
			'Delete a parcel record from the system. Only STAFF and MANAGER roles can delete parcels.',
	})
	@ApiParam({
		name: 'id',
		type: String,
		description: 'The unique ID of the parcel',
		example: 'parcel-id-123',
	})
	@ApiResponse({
		status: 200,
		description: 'Parcel deleted successfully',
		schema: {
			example: {
				success: true,
				message: 'Parcel deleted successfully',
				id: 'parcel-id-1',
			},
		},
	})
	@ApiResponse({
		status: 404,
		description: 'Parcel not found',
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden - insufficient permissions',
	})
	deleteParcel(@Param('id') id: string) {
		return this.parcelsService.deleteParcel(id);
	}
}
