import {
	ConflictException,
	ForbiddenException,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import * as authInterfaces from './interfaces/auth.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);
	constructor(
		private jwtService: JwtService,
		private readonly usersService: UsersService,
		private configService: ConfigService,
	) {}

	async getTokens(userId: string, name: string, email: string, role: string) {
		const payload: authInterfaces.JwtPayload = {
			sub: userId,
			name,
			email,
			role,
		};

		const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
		const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

		if (!accessSecret || !refreshSecret) {
			throw new Error('JWT secrets and expires not configured');
		}

		const accessToken = await this.jwtService.signAsync(payload, {
			secret: accessSecret,
			expiresIn: '1h',
		});
		const refreshToken = await this.jwtService.signAsync(payload, {
			secret: refreshSecret,
			expiresIn: '7d',
		});

		return { accessToken, refreshToken };
	}

	async login(loginDto: LoginDto) {
		//validate user
		const user = await this.usersService.validateUser(loginDto);

		this.logger.log(`User Logged in: ${user.id}`);

		await this.usersService.updateLastLogin(user.id);

		// generate tokens
		const tokens = await this.getTokens(
			user.id,
			user.name,
			user.email,
			user.role,
		);

		// save/update refreshToken to DB
		const hashedRT = await bcrypt.hash(tokens.refreshToken, 10);
		await this.usersService.updateRefreshToken(user.id, hashedRT);

		return {
			...tokens,
			user,
		};
	}

	async signup(dto: SignupDto) {
		// check existing
		const userExists = await this.usersService.userExistsByMail(dto.email);
		if (userExists) {
			throw new ConflictException('Email already taken');
		}

		// hash password
		const hashedPwd = await bcrypt.hash(dto.password, 10);

		//create user
		const newUser = await this.usersService.createNewUser({
			...dto,
			password: hashedPwd,
		});

		this.logger.log(`User registered: ${newUser.id}`);

		return 'Created account successfully. Wait for approval.';
	}

	async refreshTokens(oldRefreshToken: string) {
		try {
			const payload = await this.jwtService.verifyAsync(oldRefreshToken, {
				secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
			});

			const userId = payload.sub;

			const user = await this.usersService.getUserWithRefreshToken(userId);
			if (!user || !user.refreshToken) {
				throw new ForbiddenException('Access Denied');
			}

			const rtMatches = await bcrypt.compare(
				oldRefreshToken,
				user.refreshToken,
			);
			if (!rtMatches) throw new ForbiddenException('Invalid refresh token');

			const newTokens = await this.getTokens(
				userId,
				user.name,
				user.email,
				user.role,
			);

			const hashed = await bcrypt.hash(newTokens.refreshToken, 10);
			await this.usersService.updateRefreshToken(userId, hashed);

			return {
				...newTokens,
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
				},
			};
		} catch (error: unknown) {
			if (error instanceof JsonWebTokenError) {
				if (error.name === 'TokenExpiredError') {
					throw new UnauthorizedException('Refresh token expired');
				}
				if (error.name === 'JsonWebTokenError') {
					throw new UnauthorizedException('Invalid refresh token');
				}
			}
			throw error;
		}
	}

	async logout(userId: string) {
		this.logger.log(`User Logged out: ${userId}`);
		await this.usersService.deleteRefreshToken(userId);
	}
}
