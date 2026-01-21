export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: Record<string, any>;
}
export declare function successResponse<T>(data: T, message?: string, meta?: Record<string, any>): ApiResponse<T>;
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
export declare function paginatedResponse<T>(data: T[], meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}, message?: string): PaginatedResponse<T>;
