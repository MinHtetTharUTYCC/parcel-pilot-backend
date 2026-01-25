import { ApiProperty } from "@nestjs/swagger";

export class ApiResponseDto<T> {
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
}

export class SuccessResponseDto<T> extends ApiResponseDto<T> {
    constructor(data: T, message: string = "Success") {
        super();
        this.success = true;
        this.message = message;
        this.data = data;
    }
}