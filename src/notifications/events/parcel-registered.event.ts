export class ParcelRegisteredEvent {
	recipientId: string;
	parcelId: string;
	recipientName: string;
	residentEmail: string;
	unitNumber: string;
	pickupCode: string;
	courier: string | null;
	imageUrl: string;
	registeredAt: Date;
}
