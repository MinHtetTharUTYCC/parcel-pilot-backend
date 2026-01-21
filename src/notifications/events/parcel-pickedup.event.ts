import { ParcelRegisteredEvent } from './parcel-registered.event';

export type ParcelPickedupEvent = Omit<
	ParcelRegisteredEvent,
	'registeredAt'
> & { pickedupAt: Date };
