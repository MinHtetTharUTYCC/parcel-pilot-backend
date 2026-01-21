import { Attachment } from 'resend';

export interface TemplateData {
	recipientName?: string;
	unitNumber?: string;
	pickupCode?: string;
	courier?: string;
	registeredAt?: Date;
	pickedUpAt?: Date;
	returnedAt?: Date;
	approvedAt?: Date;
	rejectedAt?: Date;

	reminderDate?: Date;
	daysWaiting?: number;
	imgUrl?: string;
	actionUrl?: string;
	[key: string]: any;
}

export interface Template {
	subject: string;
	html: string;
	attachments: Attachment[];
}
