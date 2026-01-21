import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger(AllExceptionsFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		// Determine status code
		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		// Extract message and errors
		let message = 'Internal server error';
		let errors: any[] = [];
		let errorCode = 'UNKNOWN_ERROR';

		if (exception instanceof HttpException) {
			const exceptionResponse = exception.getResponse();

			if (typeof exceptionResponse === 'string') {
				message = exceptionResponse;
				errorCode = this.getErrorCodeFromStatus(status);
			} else if (typeof exceptionResponse === 'object') {
				const resp = exceptionResponse as any;
				message = Array.isArray(resp.message)
					? resp.message[0] || message
					: resp.message || message;
				errors = resp.errors || [];
				errorCode = resp.errorCode || this.getErrorCodeFromStatus(status);
			}
		} else if (exception instanceof Error) {
			// TODO: log the errors
			message = 'Internal server error';
			errorCode = 'INTERNAL_ERROR';
		}

		// Log errors
		if (status === Number(HttpStatus.INTERNAL_SERVER_ERROR)) {
			const errorMessage =
				exception instanceof Error ? exception.message : 'Unknown error';
			const stack = exception instanceof Error ? exception.stack : undefined;
			this.logger.error(
				`[${request.method}] ${request.url} - ${errorMessage}`,
				stack,
			);
		} else {
			this.logger.warn(
				`[${request.method}] ${request.url} - ${status}: ${message}`,
			);
		}

		// Return STANDARD format response
		response.status(status).json({
			success: false,
			message,
			data: null,
			errors: errors.length > 0 ? errors : [{ code: errorCode, message }],
			timestamp: new Date().toISOString(),
			path: request.url,
		});
	}

	private getErrorCodeFromStatus(status: number): string {
		const codes: Record<number, string> = {
			400: 'BAD_REQUEST',
			401: 'UNAUTHORIZED',
			403: 'FORBIDDEN',
			404: 'NOT_FOUND',
			409: 'CONFLICT',
			422: 'VALIDATION_ERROR',
			500: 'INTERNAL_ERROR',
		};
		return codes[status] || 'UNKNOWN_ERROR';
	}
}
