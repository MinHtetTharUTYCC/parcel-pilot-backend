import {
	Body,
	Controller,
	ForbiddenException,
	Post,
	Req,
	Res,
	UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ReqUser } from './decorators/req-user.decorator';
import * as authInterfaces from '../auth/interfaces/auth.interface';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';
import {
	ApiTags,
	ApiOperation,
	ApiBody,
	ApiResponse,
	ApiBearerAuth,
	ApiCookieAuth,
} from '@nestjs/swagger';
import {
	LoginResponseDto,
	SignupResponseDto,
	LogoutResponseDto,
} from 'src/common/responses/auth-response.dto';
import {
	UnauthorizedResponseDto,
	ValidationErrorResponseDto,
} from 'src/common/responses/error-response.dto';

const isProd = process.env.NODE_ENV === 'production';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/login')
	@ApiOperation({
		summary: 'User Login',
		description:
			'Authenticate a user with email and password. Returns access token and sets refresh token in httpOnly cookie.',
	})
	@ApiBody({
		type: LoginDto,
		description: 'User login credentials',
	})
	@ApiResponse({
		status: 200,
		description:
			'Login successful. Access token returned, refresh token set in cookie.',
		type: LoginResponseDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Invalid credentials or validation error',
		type: ValidationErrorResponseDto,
	})
	@ApiResponse({
		status: 401,
		description: 'Invalid email or password',
		type: UnauthorizedResponseDto,
	})
	async login(
		@Body() dto: LoginDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { accessToken, refreshToken, user } =
			await this.authService.login(dto);

		// set refresh tokens only in httpOnly cookie
		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: 'lax',
			path: '/',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return {
			access_token: accessToken,
			token_type: 'Bearer',
			user,
		};
	}

	@Post('signup')
	@UseInterceptors(SuccessResponseInterceptor)
	@ApiOperation({
		summary: 'User Registration',
		description:
			'Register a new user (resident) with email, name, unit number, and password.',
	})
	@ApiBody({
		type: SignupDto,
		description: 'User registration information',
	})
	@ApiResponse({
		status: 201,
		description: 'User registered successfully',
		type: SignupResponseDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Validation error or email already exists',
		type: ValidationErrorResponseDto,
	})
	async signup(@Body() dto: SignupDto) {
		return this.authService.signup(dto);
	}

	@Post('refresh')
	@ApiOperation({
		summary: 'Refresh Access Token',
		description:
			'Generate a new access token using the refresh token from cookies.',
	})
	@ApiCookieAuth('refresh_token')
	@ApiResponse({
		status: 200,
		description: 'New access token generated successfully',
		type: LoginResponseDto,
	})
	@ApiResponse({
		status: 403,
		description: 'Failed to refresh session - refresh token missing or invalid',
	})
	async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const oldRefreshToken = req.cookies['refresh_token'] as string | undefined;

		if (!oldRefreshToken) {
			throw new ForbiddenException('Failed to refresh session');
		}

		// Generate new tokens
		const {
			accessToken,
			refreshToken,
			user: refreshedUser,
		} = await this.authService.refreshTokens(oldRefreshToken);

		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: 'lax',
			path: '/',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return {
			access_token: accessToken,
			token_type: 'Bearer',
			user: refreshedUser,
		};
	}

	@Post('/logout')
	@ApiBearerAuth('access-token')
	@ApiOperation({
		summary: 'User Logout',
		description:
			'Logout the authenticated user and clear the refresh token cookie.',
	})
	@ApiResponse({
		status: 200,
		description: 'Logout successful',
		type: LogoutResponseDto,
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized - no valid token provided',
		type: UnauthorizedResponseDto,
	})
	async logout(
		@ReqUser() me: authInterfaces.RequestUser,
		@Res({ passthrough: true }) res: Response,
	) {
		const userId = me.sub;

		// clear refreshToken at DB
		await this.authService.logout(userId);

		//clear cookie in client
		res.clearCookie('refresh_token', {
			httpOnly: true,
			secure: isProd,
			sameSite: 'lax',
			path: '/',
		});

		return { success: true, message: 'Logged out successfully' };
	}
}
