import { randomBytes } from 'crypto';

export function generatePickupCode() {
	const ranB = randomBytes(3);
	const hexed = ranB.toString('hex').toUpperCase();
	return `CONDO-${hexed}`;
}

export const escapeHtml = (str: string | null | undefined): string => {
	if (!str) return '';
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;');
};

//for email
export const getFilenameFromUrl = (url: string): string => {
	const ext = url.split('.').pop()?.toLowerCase() || 'jpg';
	return `parcel.${ext}`;
};
export const isValidUrl = (url: string | null | undefined): boolean => {
	if (!url) return false;
	try {
		const parsed = new URL(url);
		return parsed.protocol === 'http:' || parsed.protocol === 'https:';
	} catch {
		return false;
	}
};
