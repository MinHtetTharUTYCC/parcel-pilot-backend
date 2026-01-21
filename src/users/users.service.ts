import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { LoginDto } from 'src/auth/dto/login.dto';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { ResidentFilterDto } from './dto/resident-filter.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ResidentApprovedEvent } from 'src/notifications/events/resident-approved.event';
import { events } from 'src/common/consts/event-names';
import { ResidentRejectedEvent } from 'src/notifications/events/resident-rejected.event';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
	CloudflareR2Service,
	ImageUploadOptions,
} from 'src/cloudflare-r2/cloudflareR2.service';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UsersService {
	constructor(
		private readonly databaseService: DatabaseService,
		private readonly eventEmitter: EventEmitter2,
		private readonly cloudflareR2Service: CloudflareR2Service,
	) {}

	async userExistsByMail(email: string): Promise<boolean> {
		const count = await this.databaseService.user.count({
			where: {
				email,
			},
		});
		return count === 1;
	}

	async createNewUser(dto: SignupDto) {
		try {
			return await this.databaseService.user.create({
				data: { ...dto },
				select: {
					id: true,
					name: true,
					email: true,
					role: true,
				},
			});
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2002'
			) {
				// prisma unique constriant
				throw new BadRequestException('Email already exists');
			}
			throw new BadRequestException('Failed to create user');
		}
	}

	//for login
	async validateUser(dto: LoginDto) {
		const user = await this.databaseService.user.findUnique({
			where: { email: dto.email },
			select: { id: true, name: true, email: true, password: true, role: true },
		});

		// user not found is unsafe(rabbit suggests)
		if (!user) throw new BadRequestException('Invalid credentials');

		const isPwdValid = await bcrypt.compare(dto.password, user.password);
		if (!isPwdValid) throw new BadRequestException('Invalid credentials');

		this.checkAccountStatus(user.role);

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		};
	}

	// for refresh
	async getUserWithRefreshToken(userId: string) {
		const user = await this.databaseService.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				name: true,
				refreshToken: true,
				email: true,
				role: true,
			},
		});
		if (!user) throw new NotFoundException('User not found');
		return user;
	}
	// for saving new refresh token
	async updateRefreshToken(userId: string, hashedRT: string) {
		await this.databaseService.user.update({
			where: { id: userId },
			data: {
				refreshToken: hashedRT,
			},
		});
	}

	async updateLastLogin(userId: string) {
		return this.databaseService.user.update({
			where: { id: userId },
			data: {
				lastLoginAt: new Date(),
			},
		});
	}

	// For log out
	async deleteRefreshToken(userId: string) {
		await this.databaseService.user.update({
			where: { id: userId },
			data: {
				refreshToken: null,
			},
		});
	}

	async getMe(userId: string) {
		const user = await this.databaseService.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				imageUrl: true,
			},
		});

		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	async getUserEmail(userId: string) {
		const user = await this.databaseService.user.findUnique({
			where: { id: userId },
			select: { email: true },
		});
		if (!user) throw new NotFoundException('User not found');

		return user.email;
	}

	private checkAccountStatus(role: UserRole) {
		switch (role) {
			case 'RESIDENT_PENDING':
				throw new ForbiddenException(
					'Account pending approval. You will be notified once approved',
				);
		}

		// TODO: Ban or reject
	}

	async approveResident(residentId: string) {
		try {
			// TODO: uncomment
			// const user = await this.databaseService.user.findUnique({
			//     where
			//         : { id: residentId },
			//     select: { role: true }
			// })

			// switch (user.role) {
			//     case "RESIDENT":
			//         throw new ConflictException("Resident already approved");
			//     case "STAFF":
			//     case "MANAGER":
			//         throw new BadRequestException("Only approved residents");

			// }

			const resident = await this.databaseService.user.update({
				where: { id: residentId },
				data: {
					role: 'RESIDENT',
					rejectedAt: null,
					approvedAt: new Date(),
				},
				select: {
					id: true,
					email: true,
					name: true,
					role: true,
					unitNumber: true,
					approvedAt: true,
				},
			});

			const approvedEvent: ResidentApprovedEvent = {
				recipientId: resident.id,
				recipientName: resident.name,
				residentEmail: resident.email,
				unitNumber: resident.unitNumber,
				approvedAt: resident.approvedAt,
			};

			this.eventEmitter.emit(events.approved, approvedEvent);

			return { residentId };
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2025'
			) {
				throw new NotFoundException('User record not found');
			}
			throw error;
		}
	}

	async rejectResident(residentId: string) {
		try {
			const user = await this.databaseService.user.findUnique({
				where: { id: residentId },
				select: { role: true },
			});

			if (!user) {
				throw new NotFoundException('User record not found');
			}

			switch (user.role) {
				case 'RESIDENT':
					throw new ConflictException('Resident already approved');
				case 'RESIDENT_REJECTED':
					throw new ConflictException('Resident already rejected');
				case 'STAFF':
				case 'MANAGER':
					throw new BadRequestException(
						'Cannot reject staff or manager accounts',
					);
			}

			const resident = await this.databaseService.user.update({
				where: { id: residentId },
				data: {
					role: 'RESIDENT_REJECTED',
					approvedAt: null,
					rejectedAt: new Date(),
				},
				select: {
					id: true,
					email: true,
					name: true,
					role: true,
					unitNumber: true,
					rejectedAt: true,
				},
			});

			const rejectedEvent: ResidentRejectedEvent = {
				recipientId: resident.id,
				recipientName: resident.name,
				residentEmail: resident.email,
				unitNumber: resident.unitNumber,
				rejectedAt: resident.rejectedAt,
			};

			this.eventEmitter.emit(events.rejected, rejectedEvent);

			return { residentId };
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2025'
			) {
				throw new NotFoundException('User record not found');
			}
			throw error;
		}
	}

	async getResidents(dto: ResidentFilterDto) {
		const { cursor, limit, pending } = dto;

		const residents = await this.databaseService.user.findMany({
			where: {
				role: pending ? 'RESIDENT_PENDING' : 'RESIDENT',
			},
			take: limit + 1,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { id: cursor } : undefined,
			select: {
				id: true,
				email: true,
				name: true,
				phone: true,
				imageUrl: true,
				unitNumber: true,
				_count: {
					select: {
						receivedParcels: true,
					},
				},
			},
		});

		const hasNext = residents.length > limit;
		const items = hasNext ? residents.slice(0, -1) : residents;
		const nextCursor = hasNext ? items[items.length - 1].id : null;

		return {
			data: items,
			meta: { limit, hasNext, nextCursor },
		};
	}

	async getStaffs(dto: PaginationDto) {
		const { cursor, limit } = dto;

		const staffs = await this.databaseService.user.findMany({
			where: { role: 'STAFF' },
			take: limit + 1,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { id: cursor } : undefined,
			select: {
				id: true,
				email: true,
				name: true,
				phone: true,
				imageUrl: true,
				unitNumber: true,
				_count: {
					select: {
						managedParcels: true,
					},
				},
			},
		});
		const hasNext = staffs.length > limit;
		const items = hasNext ? staffs.slice(0, -1) : staffs;
		const nextCursor = hasNext ? items[items.length - 1].id : null;

		return {
			data: items,
			meta: { limit, hasNext, nextCursor },
		};
	}

	async createStaff(dto: CreateStaffDto) {
		try {
			const pwdHashed = await bcrypt.hash(dto.password, 10);

			const staff = await this.databaseService.user.create({
				data: {
					name: dto.name,
					email: dto.email,
					password: pwdHashed,
					role: 'STAFF',
				},
				select: {
					id: true,
					email: true,
					name: true,
					imageUrl: true,
					createdAt: true,
				},
			});

			return { staff };
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2002'
			) {
				throw new ConflictException('Email already exists');
			}
			throw error;
		}
	}

	async updateProfile(
		userId: string,
		file: Express.Multer.File = null,
		dto: UpdateProfileDto,
	) {
		const options: ImageUploadOptions = {
			folder: 'avatars',
			maxSize: 10 * 1024 * 1024,
		};

		const uploadResult = file
			? await this.cloudflareR2Service.uploadImage(file, options)
			: null;

		const updateUser = await this.databaseService.user.update({
			where: { id: userId },
			data: {
				name: dto.name,
				...(uploadResult && {
					imageKey: uploadResult.key,
					imageUrl: uploadResult.url,
				}),
			},
			select: {
				id: true,
				name: true,
				imageUrl: true,
			},
		});

		return {
			id: updateUser.id,
			name: updateUser.name,
			imageUrl: updateUser.imageUrl,
		};
	}

	async updateUnit(dto: UpdateUnitDto) {
		const updateUser = await this.databaseService.user.update({
			where: { id: dto.residentId, role: 'RESIDENT' },
			data: {
				unitNumber: dto.unitNumber,
			},
			select: {
				id: true,
				unitNumber: true,
			},
		});

		return { id: updateUser.id, unitNumber: updateUser.unitNumber };
	}
}
