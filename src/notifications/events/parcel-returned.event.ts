import { ParcelRegisteredEvent } from './parcel-registered.event';

export type ParcelReturnedEvent = Omit<
	ParcelRegisteredEvent,
	'registeredAt'
> & { returnedAt: Date };
