import { ApiProperty } from "@nestjs/swagger";

export class NotificationDto {
    @ApiProperty({
        description: "Notification ID",
        example: "notification-id-123",
        type: String,
    })
    id: string;
    @ApiProperty({
        description: "Notification type",
        example: "PARCEL_ARRIVAL",
        type: String,
    })
    type: string;
    @ApiProperty({
        description: "Notification title",
        example: "New Parcel Arrived",
        type: String,
    })
    title: string;
    @ApiProperty({
        description: "Notification message",
        example: "Your parcel from DHL has arrived at the front desk.",
        type: String,
    })
    message: string;
    @ApiProperty({
        description: "Action URL for the notification",
        example: "https://example.com/parcels/parcel-id-123",
        type: String,
    })
    actionUrl: string;
    @ApiProperty({
        description: "Read status of the notification",
        example: false,
        type: Boolean,
    })
    isRead: boolean;
    @ApiProperty({
        description: "Creation timestamp",
        example: "2026-01-15T10:30:00Z",
        type: String,
    })
    createdAt: Date;
}

export class NotificationListMetaDto {
    @ApiProperty({
        description: "Total number of notifications",
        example: 100,
        type: Number,
    })
    total: number;

    @ApiProperty({
        description: "Total number of pages",
        example: 5,
        type: Number,
    })
    totalPages: number;

    @ApiProperty({
        description: "Indicator if there is a next page",
        example: true,
        type: Boolean,
    })
    hasNext: boolean;

    @ApiProperty({
        description: "Current page limit",
        example: 20,
        type: Number,
    })
    limit: number;

    @ApiProperty({
        description: "Current page number",
        example: 1,
        type: Number,
    })
    page?: number;
}
export class NotificationListResponseDto {
    @ApiProperty({
        description: "Array of notifications",
        type: [NotificationDto],
    })
    data: NotificationDto[];

    @ApiProperty({
        description: "Pagination metadata",
        type: NotificationListMetaDto,
    })
    meta: NotificationListMetaDto;
}
