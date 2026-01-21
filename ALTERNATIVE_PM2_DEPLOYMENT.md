# Alternative: PM2 Deployment (without Docker)

If you prefer not to use Docker, you can deploy with PM2.

## Prerequisites

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Enable corepack for pnpm
sudo corepack enable

# Install PM2 globally
npm install -g pm2

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Redis
sudo apt install redis-server -y
```

## Database Setup

```bash
# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE parcel_pilot;
CREATE USER parcel_pilot WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE parcel_pilot TO parcel_pilot;
\c parcel_pilot
GRANT ALL ON SCHEMA public TO parcel_pilot;
EOF
```

## Application Setup

```bash
# Clone and setup
cd /home/$USER
git clone <your-repo> parcel-pilot
cd parcel-pilot/backend

# Create production env
cp .env.production.example .env.production
nano .env.production
```

Update `.env.production`:

```env
DATABASE_URL="postgresql://parcel_pilot:your_password@localhost:5432/parcel_pilot?schema=public"
REDIS_HOST=localhost
# ... other variables
```

## Build and Deploy

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Build application
pnpm run build
```

## PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
	apps: [
		{
			name: 'parcel-pilot-api',
			script: './dist/main.js',
			instances: 2,
			exec_mode: 'cluster',
			env: {
				NODE_ENV: 'production',
			},
			error_file: './logs/api-error.log',
			out_file: './logs/api-out.log',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			merge_logs: true,
		},
		{
			name: 'parcel-pilot-worker',
			script: './dist/worker.js',
			instances: 1,
			env: {
				NODE_ENV: 'production',
			},
			error_file: './logs/worker-error.log',
			out_file: './logs/worker-out.log',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
		},
	],
};
```

## Start Services

```bash
# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js

# Configure PM2 to start on boot
pm2 startup
pm2 save

# View logs
pm2 logs

# Monitor
pm2 monit
```

## PM2 Commands

```bash
# Status
pm2 status

# Restart
pm2 restart all
pm2 restart parcel-pilot-api
pm2 restart parcel-pilot-worker

# Stop
pm2 stop all

# Logs
pm2 logs
pm2 logs parcel-pilot-api
pm2 logs parcel-pilot-worker --lines 100

# Delete
pm2 delete all
```

## Update Script for PM2

Create `update-pm2.sh`:

```bash
#!/bin/bash

echo "Updating Parcel Pilot..."

# Pull latest code
git pull origin main

# Install dependencies
pnpm install --frozen-lockfile

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Build
pnpm run build

# Restart PM2 apps
pm2 restart ecosystem.config.js

echo "Update complete!"
pm2 status
```

Make it executable:

```bash
chmod +x update-pm2.sh
```

## Nginx Configuration (same as Docker)

Use the same `nginx.conf` provided.

## Advantages of PM2 over Docker

- Lower resource usage
- Easier log access
- Simpler debugging
- Built-in clustering
- Automatic restarts
- Easier monitoring

## Disadvantages

- Manual dependency management
- Less isolation
- More complex initial setup
- Need to manage PostgreSQL/Redis separately

Choose based on your preference and infrastructure requirements.
