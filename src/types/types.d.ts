import { RequestUser } from 'src/auth/interfaces/auth.interface';

declare global {
	namespace Express {
		interface Request {
			user?: RequestUser;
		}
	}
}
