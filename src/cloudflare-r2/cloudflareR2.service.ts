import { Injectable, Logger } from '@nestjs/common';
import {
	PutObjectCommand,
	S3Client,
	DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

export interface ImageUploadOptions {
	folder: string;
	/** Generate unique filename? Default: true */
	generateUniqueName?: boolean;
	/** Maximum file size in bytes (default: 5MB) */
	maxSize?: number;
	/** Allowed MIME types (default: common image types) */
	allowedMimeTypes?: string[];
}

@Injectable()
export class CloudflareR2Service {
	private readonly s3Client: S3Client;
	private readonly bucketName: string;
	private readonly endpoint: string;
	private readonly logger = new Logger(CloudflareR2Service.name);

	// Default allowed image types
	private readonly DEFAULT_ALLOWED_TYPES = [
		'image/jpeg',
		'image/jpg',
		'image/png',
		'image/webp',
	];

	// Default max size: 5MB
	private readonly DEFAULT_MAX_SIZE = 5 * 1024 * 1024;

	constructor(private configService: ConfigService) {
		const r2AccessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
		const r2SecretAccessKey = this.configService.get<string>(
			'R2_SECRET_ACCESS_KEY',
		);
		this.endpoint = this.configService.get<string>('R2_ENDPOINT');
		this.bucketName = this.configService.get<string>('R2_BUCKET_NAME');

		if (
			!r2AccessKeyId ||
			!r2SecretAccessKey ||
			!this.endpoint ||
			!this.bucketName
		) {
			throw new Error('Missing required R2 configuration');
		}

		this.s3Client = new S3Client({
			region: 'auto',
			endpoint: this.endpoint,
			credentials: {
				accessKeyId: r2AccessKeyId,
				secretAccessKey: r2SecretAccessKey,
			},
			forcePathStyle: true,
		});
	}

	/**
	 * Upload an image to Cloudflare R2
	 * @param file - The image file from Multer
	 * @param options - Upload options
	 * @returns Upload result with URL
	 */
	async uploadImage(
		file: Express.Multer.File,
		options: ImageUploadOptions,
	): Promise<{
		url: string;
		key: string;
		originalName: string;
		size: number;
		mimetype: string;
	}> {
		try {
			// Validate the image
			this.validateImage(file, options);

			// Generate file key (path in bucket)
			const key = this.generateFileKey(file.originalname, options);

			// Upload to R2
			await this.uploadToR2(file.buffer, key, file.mimetype);

			// Generate public URL (assuming public bucket or CDN)
			const publicUrl = this.generatePublicUrl(key);

			this.logger.log(`Image uploaded successfully: ${key}`);

			return {
				url: publicUrl,
				key,
				originalName: file.originalname,
				size: file.size,
				mimetype: file.mimetype,
			};
		} catch (error) {
			this.logger.error(
				`Failed to upload image: ${error.message}`,
				error.stack,
			);
			throw new Error(`Image upload failed: ${error.message}`);
		}
	}

	/**
	 * Validate image before upload
	 */
	private validateImage(
		file: Express.Multer.File,
		options: ImageUploadOptions,
	): void {
		const maxSize = options.maxSize || this.DEFAULT_MAX_SIZE;
		const allowedTypes = options.allowedMimeTypes || this.DEFAULT_ALLOWED_TYPES;

		// Check file size
		if (file.size > maxSize) {
			throw new Error(
				`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`,
			);
		}

		// Check MIME type
		if (!allowedTypes.includes(file.mimetype.toLowerCase())) {
			throw new Error(
				`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
			);
		}

		// Optional: Add more validations here
		// e.g., check image dimensions using sharp library
	}

	/**
	 * Generate a unique file key/path
	 */
	private generateFileKey(
		originalName: string,
		options: ImageUploadOptions,
	): string {
		const generateUniqueName = options.generateUniqueName ?? true;

		let fileName: string;

		if (generateUniqueName) {
			// Extract file extension
			const extension = originalName.split('.').pop();
			// Generate unique filename with timestamp
			const uniqueId = uuidv4().split('-')[0]; // First part of UUID
			const timestamp = Date.now();
			fileName = `${timestamp}-${uniqueId}.${extension}`;
		} else {
			// Sanitize original filename
			fileName = originalName.toLowerCase().replace(/[^a-z0-9.]/g, '-');
		}

		return `${options.folder}/${fileName}`;
	}

	/**
	 * Upload buffer to R2
	 */
	private async uploadToR2(
		buffer: Buffer,
		key: string,
		contentType: string,
	): Promise<void> {
		const command = new PutObjectCommand({
			Bucket: this.bucketName,
			Key: key,
			Body: buffer,
			ContentType: contentType,
			// Add cache control for images (1 year cache)
			CacheControl: 'public, max-age=31536000',
			// Optional: Add metadata
			Metadata: {
				uploadedAt: new Date().toISOString(),
			},
		});

		await this.s3Client.send(command);
	}

	private generatePublicUrl(key: string): string {
		// public URL
		const publicDomain = this.configService.get<string>('R2_PUBLIC_DOMAIN');

		if (!publicDomain) throw new Error('R2 public domin is required');

		// TODO: custom Domain for prod
		return `${publicDomain}/${key}`;
	}

	async deleteImage(key: string): Promise<{ success: boolean }> {
		try {
			const command = new DeleteObjectCommand({
				Bucket: this.bucketName,
				Key: key,
			});

			await this.s3Client.send(command);
			this.logger.log(`Image deleted successfully: ${key}`);

			return { success: true };
		} catch (error) {
			this.logger.error(`Failed to delete image: ${error.message}`);
			throw new Error(`Image deletion failed: ${error.message}`);
		}
	}

	/**
	 * Upload image from base64 string
	 */
	async uploadImageFromBase64(
		base64String: string,
		filename: string,
		options: ImageUploadOptions,
	): Promise<{ url: string; key: string }> {
		try {
			// Extract MIME type and data from base64
			const matches = base64String.match(/^data:(.+);base64,(.+)$/);
			if (!matches) {
				throw new Error('Invalid base64 string format');
			}

			const mimetype = matches[1];
			const buffer = Buffer.from(matches[2], 'base64');

			// Create a file-like object
			const file = {
				originalname: filename,
				mimetype,
				size: buffer.length,
				buffer,
			} as Express.Multer.File;

			return this.uploadImage(file, options);
		} catch (error) {
			this.logger.error(`Failed to upload base64 image: ${error.message}`);
			throw new Error(`Base64 image upload failed: ${error.message}`);
		}
	}
}
