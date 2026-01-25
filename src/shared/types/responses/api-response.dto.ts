import { ApiProperty } from "@nestjs/swagger";

export class ApiResponseDto<T = any> {
    @ApiProperty({
        description: "Request success status",
        example: true,
        type: Boolean,
    })
    success: boolean;

    @ApiProperty({
        description: "Response message",
        example: "Success",
        type: String,
    })
    message: string;

    @ApiProperty({
        description: "Response data",
    })
    data: T;

    @ApiProperty({
        description: "Additional metadata",
        required: false,
        type: Object,
    })
    meta?: Record<string, any>;
}

export class PaginationMetaDto {
    @ApiProperty({
        description: "Current page number",
        example: 1,
        type: Number,
    })
    page: number;

    @ApiProperty({
        description: "Items per page",
        example: 10,
        type: Number,
    })
    limit: number;

    @ApiProperty({
        description: "Total number of items",
        example: 100,
        type: Number,
    })
    total: number;

    @ApiProperty({
        description: "Total number of pages",
        example: 10,
        type: Number,
    })
    totalPages: number;

    @ApiProperty({
        description: "Whether there's a next page",
        example: true,
        type: Boolean,
    })
    hasNext: boolean;
}

export class PaginatedApiResponseDto<T = any> extends ApiResponseDto<T[]> {
    @ApiProperty({
        description: "Array of items",
        isArray: true,
    })
    data: T[];

    @ApiProperty({
        description: "Pagination metadata",
        type: PaginationMetaDto,
    })
    meta: PaginationMetaDto;
}

// Helper function to create typed response DTOs for OpenAPI documentation
export function createApiResponseDto<T>(dataType: new () => T) {
    class TypedApiResponseDto extends ApiResponseDto<T> {
        @ApiProperty({
            description: "Response data",
            type: dataType,
        })
        data: T;
    }

    // Set a meaningful name for better OpenAPI documentation
    Object.defineProperty(TypedApiResponseDto, 'name', {
        value: `${dataType.name}ApiResponse`
    });

    return TypedApiResponseDto;
}

// Helper function to create paginated response DTOs for OpenAPI documentation
export function createPaginatedResponseDto<T>(itemType: new () => T) {
    class TypedPaginatedResponseDto extends PaginatedApiResponseDto<T> {
        @ApiProperty({
            description: "Array of items",
            type: [itemType],
            isArray: true,
        })
        data: T[];
    }

    Object.defineProperty(TypedPaginatedResponseDto, 'name', {
        value: `${itemType.name}PaginatedResponse`
    });

    return TypedPaginatedResponseDto;
}