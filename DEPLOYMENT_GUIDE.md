# Deployment Guide - Digital Ocean VPS

This guide will help you deploy the Parcel Pilot backend to your Digital Ocean VPS.

## Prerequisites

- Digital Ocean VPS (Ubuntu 22.04 LTS recommended)
- Domain name pointed to your VPS IP
- SSH access to your VPS

## Step 1: Initial Server Setup

### 1.1 Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose -y

# Verify installation
docker --version
docker-compose --version
```

### 1.3 Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 1.4 Install Certbot (for SSL)

```bash
sudo apt install certbot python3-certbot-nginx -y
```

## Step 2: Clone Repository

```bash
# Install git if not already installed
sudo apt install git -y

# Clone your repository
cd /home/$USER
git clone <your-repo-url> parcel-pilot
cd parcel-pilot/backend
```

## Step 3: Configure Environment

### 3.1 Create Production Environment File

```bash
cp .env.production.example .env.production
nano .env.production
```

### 3.2 Update the following variables:

- `JWT_SECRET`: Generate a strong secret (use `openssl rand -base64 32`)
- `R2_*`: Your Cloudflare R2 credentials
- `RESEND_API_KEY`: Your Resend API key
- `RESEND_FROM_EMAIL`: Your verified sender email
- `CORS_ORIGIN`: Your frontend domain
- `COOKIE_DOMAIN`: Your domain
- `DATABASE_URL`: Keep as is (uses docker-compose postgres)

### 3.3 Generate Secure JWT Secret

```bash
openssl rand -base64 32
```

Copy this value to `JWT_SECRET` in `.env.production`

## Step 4: Configure Nginx Reverse Proxy

### 4.1 Copy Nginx Configuration

```bash
sudo cp nginx.conf /etc/nginx/sites-available/parcel-pilot
```

### 4.2 Edit the configuration

```bash
sudo nano /etc/nginx/sites-available/parcel-pilot
```

Replace `your-domain.com` with your actual domain.

### 4.3 Enable the site

```bash
sudo ln -s /etc/nginx/sites-available/parcel-pilot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: Setup SSL with Let's Encrypt

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the prompts. Certbot will automatically configure SSL and set up auto-renewal.

## Step 6: Deploy Application

### 6.1 Make deployment script executable

```bash
chmod +x deploy.sh
```

### 6.2 Run deployment

```bash
./deploy.sh
```

This script will:

- Stop existing containers
- Build fresh Docker images
- Run database migrations
- Start all services (API, Worker, PostgreSQL, Redis)

## Step 7: Verify Deployment

### 7.1 Check container status

```bash
docker-compose ps
```

All containers should be "Up" and healthy.

### 7.2 Check logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f worker
```

### 7.3 Test API

```bash
curl https://your-domain.com/api
```

You should see the Swagger documentation.

## Step 8: Configure Firewall

```bash
# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Step 9: Setup Monitoring (Optional but Recommended)

### 9.1 Install monitoring tools

```bash
sudo apt install htop -y
```

### 9.2 Monitor Docker containers

```bash
docker stats
```

## Maintenance Commands

### Update and Redeploy

```bash
cd /home/$USER/parcel-pilot/backend
git pull origin main
./deploy.sh
```

### View Logs

```bash
docker-compose logs -f api
docker-compose logs -f worker
```

### Restart Services

```bash
docker-compose restart api
docker-compose restart worker
```

### Stop All Services

```bash
docker-compose down
```

### Backup Database

```bash
docker-compose exec postgres pg_dump -U parcel_pilot parcel_pilot > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
docker-compose exec -T postgres psql -U parcel_pilot parcel_pilot < backup_file.sql
```

## Troubleshooting

### Check if services are running

```bash
docker-compose ps
systemctl status nginx
```

### View container logs

```bash
docker-compose logs -f
```

### Restart everything

```bash
docker-compose down
docker-compose up -d
```

### Check disk space

```bash
df -h
```

### Clean up Docker resources

```bash
docker system prune -a --volumes
```

## Security Checklist

- [ ] Changed default DATABASE_URL password in docker-compose.yml
- [ ] Set strong JWT_SECRET in .env.production
- [ ] Configured firewall (ufw)
- [ ] SSL certificate installed and auto-renewal configured
- [ ] Regular backups configured
- [ ] Monitoring setup
- [ ] Log rotation configured
- [ ] Non-root user for deployment

## Performance Optimization

### 1. Enable Gzip in Nginx

Add to nginx.conf:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### 2. Setup PM2 for process management (alternative to Docker)

If you prefer PM2 over Docker:

```bash
npm install -g pm2
pm2 start dist/main.js --name api
pm2 start dist/worker.js --name worker
pm2 startup
pm2 save
```

## Support

For issues or questions, check:

- Application logs: `docker-compose logs -f`
- Nginx logs: `/var/log/nginx/parcel-pilot-error.log`
- System logs: `journalctl -u nginx`

## Auto-Deployment with GitHub Actions (Optional)

Create `.github/workflows/deploy.yml` in your repository for automatic deployments on push to main branch.
