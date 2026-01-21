import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { generatePickupCode } from 'src/common/utils';
import { ParcelStatus, Prisma, UserRole } from '@prisma/client';
import { RequestUser } from 'src/auth/interfaces/auth.interface';
import { UpdateParcelDto } from './dto/update-parcel.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { GetParcelsFilterDto } from './dto/get-parcels.filter.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ParcelRegisteredEvent } from 'src/notifications/events/parcel-registered.event';
import { ParcelPickedupEvent } from 'src/notifications/events/parcel-pickedup.event';
import { ParcelReturnedEvent } from 'src/notifications/events/parcel-returned.event';
import { events } from 'src/common/consts/event-names';
import {
	CloudflareR2Service,
	ImageUploadOptions,
} from 'src/cloudflare-r2/cloudflareR2.service';

@Injectable()
export class ParcelsService {
	constructor(
		private databaseService: DatabaseService,
		private eventEmitter: EventEmitter2,
		private cloudflareR2Service: CloudflareR2Service,
	) {}

	async getParcels(user: RequestUser, dto: GetParcelsFilterDto) {
		const { cursor, limit, q } = dto;
		const whereCondition: Prisma.ParcelWhereInput = {};

		// registered date cursor
		if (cursor) {
			whereCondition.registeredAt = { lt: new Date(cursor) };
		}

		// search
		if (q) {
			whereCondition.OR = [
				{ pickupCode: { contains: q, mode: 'insensitive' } },
				{ orderId: { contains: q, mode: 'insensitive' } },
				{ courier: { contains: q, mode: 'insensitive' } },
				{ description: { contains: q, mode: 'insensitive' } },

				{
					recipient: {
						OR: [
							{ unitNumber: { contains: q, mode: 'insensitive' } },
							{ name: { contains: q, mode: 'insensitive' } },
							{ email: { contains: q, mode: 'insensitive' } },
							{ phone: { contains: q, mode: 'insensitive' } },
						],
					},
				},
			];
		}

		const parcels = await this.databaseService.parcel.findMany({
			where: whereCondition,
			take: limit + 1,
			orderBy: { registeredAt: 'desc' },
			include: this.getIncludeForParcel(user.role as UserRole),
		});

		const hasNext = parcels.length > limit;
		const items = hasNext ? parcels.slice(0, -1) : parcels;
		const nextCursor = hasNext
			? items[items.length - 1].registeredAt.toISOString()
			: null;

		return {
			data: items,
			meta: { limit, hasNext, nextCursor },
		};
	}

	async getMyParcels(userId: string, dto: GetParcelsFilterDto) {
		const { cursor, limit, q } = dto;

		// ownership
		const whereCondition: Prisma.ParcelWhereInput = {
			recipientId: userId,
		};

		// registered date cursor
		if (cursor) {
			whereCondition.registeredAt = { lt: new Date(cursor) };
		}

		// search
		if (q) {
			whereCondition.OR = [
				{ pickupCode: { contains: q, mode: 'insensitive' } },
				{ orderId: { contains: q, mode: 'insensitive' } },
				{ courier: { contains: q, mode: 'insensitive' } },
				{ description: { contains: q, mode: 'insensitive' } },
			];
		}

		const parcels = await this.databaseService.parcel.findMany({
			where: whereCondition,
			take: limit + 1,
			orderBy: {
				registeredAt: 'desc',
			},
			include: this.getIncludeForParcel(UserRole.RESIDENT),
		});

		const hasNext = parcels.length > limit;
		const items = hasNext ? parcels.slice(0, -1) : parcels;
		const nextCursor = hasNext
			? items[items.length - 1].registeredAt.toISOString()
			: null;

		return {
			data: items,
			meta: { limit, hasNext, nextCursor },
		};
	}

	async getParcel(user: RequestUser, parcelId: string) {
		const whereClause =
			user.role === 'RESIDENT'
				? { id: parcelId, recipientId: user.sub }
				: { id: parcelId };

		const parcel = await this.databaseService.parcel.findUnique({
			where: whereClause,
			include: this.getIncludeForParcel(user.role as UserRole),
		});

		if (!parcel) {
			throw new NotFoundException('Parcel not found or access denied');
		}

		return parcel;
	}

	private getIncludeForParcel(role: UserRole): Prisma.ParcelInclude {
		const baseInclude = {
			recipient: {
				select: {
					name: true,
					unitNumber: true,
				},
			},
			imageKey: true,
			imageUrl: true,
		};

		switch (role) {
			case 'STAFF':
			case 'MANAGER':
				return {
					...baseInclude,
					recipient: {
						select: {
							id: true,
							name: true,
							email: true,
							phone: true,
							unitNumber: true,
						},
					},
					receivedBy: { select: { name: true, email: true } },
				};

			case 'RESIDENT':
				return baseInclude;

			default:
				return baseInclude;
		}
	}

	async createParcel(
		dto: CreateParcelDto,
		file: Express.Multer.File,
		userId: string,
	) {
		const pickupCode = generatePickupCode();
		const { recipientId, ...restOfDto } = dto;

		const options: ImageUploadOptions = {
			folder: 'parcels',
			maxSize: 10 * 1024 * 1024,
		};

		const uploadResult = await this.cloudflareR2Service.uploadImage(
			file,
			options,
		);

		try {
			const parcel = await this.databaseService.parcel.create({
				data: {
					...restOfDto,
					imageKey: uploadResult.key,
					imageUrl: uploadResult.url,
					recipient: {
						connect: { id: recipientId },
					},
					receivedBy: {
						connect: { id: userId },
					},
					pickupCode,
				},
				select: {
					id: true,
					recipientId: true,
					recipient: {
						select: {
							name: true,
							email: true,
							unitNumber: true,
						},
					},
					imageKey: true,
					imageUrl: true,
					pickupCode: true,
					courier: true,
					registeredAt: true,
				},
			});

			const parcelRegisteredEvent: ParcelRegisteredEvent = {
				recipientId: parcel.recipientId,
				parcelId: parcel.id,
				recipientName: parcel.recipient.name,
				residentEmail: parcel.recipient.email,
				unitNumber: parcel.recipient.unitNumber,
				pickupCode: parcel.pickupCode,
				courier: parcel.courier,
				imageUrl: parcel.imageUrl,
				registeredAt: parcel.registeredAt,
			};

			this.eventEmitter.emit(events.registered, parcelRegisteredEvent);

			return parcel;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException('User Not Found');
				}
			}

			throw error;
		}
	}

	async updateParcel(dto: UpdateParcelDto, parcelId: string) {
		try {
			await this.databaseService.parcel.update({
				where: { id: parcelId },
				data: { ...dto },
			});

			return { parcelId };
		} catch (error: unknown) {
			if (
				error instanceof PrismaClientKnownRequestError &&
				error.code === 'P2025'
			) {
				throw new NotFoundException('Parcel not found');
			}
			throw error;
		}
	}

	async pickupParcel(parcelId: string) {
		try {
			const parcel = await this.databaseService.parcel.update({
				where: { id: parcelId },
				data: {
					status: 'PICKED_UP',
					pickedUpAt: new Date(),
					returnedAt: null,
				},
				select: {
					id: true,
					recipientId: true,
					recipient: {
						select: {
							name: true,
							email: true,
							unitNumber: true,
						},
					},
					pickupCode: true,
					courier: true,
					imageUrl: true,
					pickedUpAt: true,
				},
			});

			const parcelPickedupEvent: ParcelPickedupEvent = {
				recipientId: parcel.recipientId,
				parcelId: parcel.id,
				recipientName: parcel.recipient.name,
				residentEmail: parcel.recipient.email,
				unitNumber: parcel.recipient.unitNumber,
				pickupCode: parcel.pickupCode,
				courier: parcel.courier,
				imageUrl: parcel.imageUrl,
				pickedupAt: parcel.pickedUpAt,
			};

			this.eventEmitter.emit(events.pickedup, parcelPickedupEvent);

			return { parcelId, messages: 'Marked as pickedup successfully' };
		} catch (error: unknown) {
			if (
				error instanceof PrismaClientKnownRequestError &&
				error.code === 'P2025'
			) {
				throw new NotFoundException('Parcel not found');
			}
			throw error;
		}
	}
	async returnParcel(parcelId: string) {
		try {
			const parcel = await this.databaseService.parcel.update({
				where: { id: parcelId },
				data: {
					status: 'RETURNED',
					returnedAt: new Date(),
					pickedUpAt: null,
				},
				select: {
					id: true,
					recipientId: true,
					recipient: {
						select: {
							name: true,
							email: true,
							unitNumber: true,
						},
					},
					pickupCode: true,
					courier: true,
					imageUrl: true,
					returnedAt: true,
				},
			});

			const parcelReturnedEvent: ParcelReturnedEvent = {
				recipientId: parcel.recipientId,
				parcelId: parcel.id,
				recipientName: parcel.recipient.name,
				residentEmail: parcel.recipient.email,
				unitNumber: parcel.recipient.unitNumber,
				pickupCode: parcel.pickupCode,
				courier: parcel.courier,
				imageUrl: parcel.imageUrl,
				returnedAt: parcel.returnedAt,
			};

			this.eventEmitter.emit(events.returned, parcelReturnedEvent);

			return { parcelId, messages: 'Marked as returned successfully' };
		} catch (error: unknown) {
			if (
				error instanceof PrismaClientKnownRequestError &&
				error.code === 'P2025'
			) {
				throw new NotFoundException('Parcel not found');
			}
			throw error;
		}
	}

	async readyForPickup(parcelId: string) {
		try {
			await this.databaseService.parcel.update({
				where: { id: parcelId },
				data: {
					status: 'READY_FOR_PICKUP',
				},
				select: {
					id: true,
				},
			});
		} catch (error: unknown) {
			if (
				error instanceof PrismaClientKnownRequestError &&
				error.code === 'P2025'
			) {
				throw new NotFoundException('Parcel not found');
			}
			throw error;
		}
	}

	async deleteParcel(parcelId: string) {
		try {
			await this.databaseService.parcel.delete({ where: { id: parcelId } });
			return { parcelId };
		} catch (error) {
			if (
				error instanceof PrismaClientKnownRequestError &&
				error.code === 'P2025'
			) {
				throw new NotFoundException('Parcel not found');
			}
		}
	}

	async getPendingParcels() {
		const pendingParcels = await this.databaseService.parcel.findMany({
			where: {
				status: ParcelStatus.READY_FOR_PICKUP,
				pickedUpAt: null,
			},
			include: {
				recipient: {
					select: {
						id: true,
						name: true,
						email: true,
						unitNumber: true,
					},
				},
			},
			orderBy: {
				registeredAt: 'asc',
			},
		});

		return pendingParcels;
	}
}
