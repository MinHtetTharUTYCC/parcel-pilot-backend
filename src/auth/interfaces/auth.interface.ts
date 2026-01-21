import { Request } from 'express';

export interface JwtPayload {
	sub: string;
	name: string;
	email: string;
	role: string;
}

export interface RequestUser {
	sub: string;
	email: string;
	name: string;
	role: string;
}

export interface RequestWithRefreshToken extends Request {
	user: RequestUser & { refresh_token: string };
	cookies: {
		refresh_token?: string;
	};
}
