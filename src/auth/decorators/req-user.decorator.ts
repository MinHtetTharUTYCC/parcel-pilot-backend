import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as authInterfaces from '../interfaces/auth.interface';

export const ReqUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): authInterfaces.RequestUser => {
		const request = ctx.switchToHttp().getRequest();
		return request.user; //comes from Authguard
	},
);
