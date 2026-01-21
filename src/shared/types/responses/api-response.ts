export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: Record<string, any>;
}

export function successResponse<T>(
    data: T,
    message = 'Success',
    meta?: Record<string, any>
): ApiResponse<T> {
    return {
        success: true,
        message,
        data,
        meta,
    };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export function paginatedResponse<T>(
    data: T[],
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    },
    message = "Success"
): PaginatedResponse<T> {
    return {
        success: true,
        message,
        data,
        meta,
    }
}
