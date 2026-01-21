import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as pg from 'pg';

@Injectable()
export class DatabaseService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private pool: pg.Pool;

	constructor() {
		// instantiate the driver instance
		const connectionString = process.env.DATABASE_URL;
		// const connectionString = "postgresql://condo_admin:condo_admin@localhost:5432/condo_parcel?schema=public";
		if (!connectionString) {
			throw new Error('DATABASE_URL environment is not set');
		}

		const newPool = new pg.Pool({ connectionString });
		const adapter = new PrismaPg(newPool);

		super({ adapter });
		this.pool = newPool;
	}

	async onModuleInit() {
		await this.$connect();
	}

	async onModuleDestroy() {
		await this.$disconnect();
		await this.pool.end();
	}
}
