import { Test, TestingModule } from '@nestjs/testing';
import { CloudflareR2Service } from './cloudflareR2.service';
import { ConfigService } from '@nestjs/config';

describe('CloudflareR2Service', () => {
	let service: CloudflareR2Service;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CloudflareR2Service,
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn((key: string) => {
							const config: Record<string, string> = {
								R2_ACCOUNT_ID: 'test-account-id',
								R2_ACCESS_KEY_ID: 'test-access-key',
								R2_SECRET_ACCESS_KEY: 'test-secret-key',
								R2_BUCKET_NAME: 'test-bucket',
							};
							return config[key];
						}),
					},
				},
			],
		}).compile();

		service = module.get<CloudflareR2Service>(CloudflareR2Service);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
