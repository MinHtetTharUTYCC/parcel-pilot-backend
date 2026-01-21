import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { paginatedResponse, successResponse } from '@parcel-pilot/shared';

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data) => {
				//if already standard response, leave it
				if (data?.success !== undefined) return data;

				// if paginated data
				if (data?.data && data?.meta && data.meta.page !== undefined) {
					return paginatedResponse(data.data, data.meta);
				}

				//wrap raw data in standard success response
				return successResponse(data);
			}),
		);
	}
}
