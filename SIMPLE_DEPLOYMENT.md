# Simple Deployment Guide (No Domain)

Perfect for demo/learning projects with frontend on Vercel.

## 🎯 Architecture

- **Backend**: Digital Ocean VPS (HTTP only, no domain)
- **Frontend**: Vercel (free tier with vercel.app domain)
- **No SSL**: Suitable for demo/learning
- **Cost**: ~$4-6/month for VPS

## 🚀 Quick Start

### 1. Create Digital Ocean Droplet

- Choose Ubuntu 22.04 LTS
- Select $4-6/month basic droplet
- Add your SSH key
- Create droplet

### 2. SSH into Your VPS

```bash
ssh root@YOUR_VPS_IP
```

### 3. Clone Repository

```bash
git clone <your-repo-url> parcel-pilot
cd parcel-pilot/backend
```

### 4. Configure Environment

The `.env.production` file is already created with your credentials.

**Update these values:**

```bash
nano .env.production
```

Replace:

- `YOUR_VPS_IP` - with your actual VPS IP (run `curl ifconfig.me` to get it)
- `your-app.vercel.app` - with your Vercel URL (after deploying frontend)

### 5. Deploy

```bash
chmod +x deploy-simple.sh
./deploy-simple.sh
```

This script will:

- ✅ Install Docker & Docker Compose (if needed)
- ✅ Build your application
- ✅ Start PostgreSQL, Redis, API, and Worker
- ✅ Run database migrations
- ✅ Show you your public URL

### 6. Configure Firewall

```bash
# Allow SSH and API port
ufw allow 22/tcp
ufw allow 6000/tcp
ufw enable
```

### 7. Test Your API

```bash
# Get your public IP
curl ifconfig.me

# Test health endpoint
curl http://YOUR_IP:6000/health

# Open API docs in browser
# http://YOUR_IP:6000/api
```

## 🌐 Deploy Frontend to Vercel

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy

```bash
cd ../frontend  # or your frontend directory
vercel
```

### 3. Set Environment Variables

In Vercel dashboard or CLI:

```bash
VITE_API_URL=http://YOUR_VPS_IP:6000
```

### 4. Update Backend

After getting your Vercel URL (e.g., `https://parcel-pilot.vercel.app`):

```bash
# On VPS
cd ~/parcel-pilot/backend
nano .env.production
# Update FRONTEND_URL and CORS_ORIGINS with your Vercel URL

# Restart backend
docker-compose -f docker-compose.simple.yml restart backend
```

## 📊 Daily Operations

### View Logs

```bash
docker-compose -f docker-compose.simple.yml logs -f backend
docker-compose -f docker-compose.simple.yml logs -f worker
```

### Restart Services

```bash
docker-compose -f docker-compose.simple.yml restart backend
docker-compose -f docker-compose.simple.yml restart worker
```

### Stop Everything

```bash
docker-compose -f docker-compose.simple.yml down
```

### Update Code

```bash
git pull origin main
docker-compose -f docker-compose.simple.yml down
docker-compose -f docker-compose.simple.yml up -d --build
docker-compose -f docker-compose.simple.yml exec -T backend npx prisma migrate deploy
```

### Backup Database

```bash
docker-compose -f docker-compose.simple.yml exec -T postgres pg_dump -U parcel_pilot_admin parcel-pilot > backup_$(date +%Y%m%d).sql
```

## 🔧 Troubleshooting

### Can't connect to API

```bash
# Check if containers are running
docker-compose -f docker-compose.simple.yml ps

# Check firewall
ufw status

# Check logs
docker-compose -f docker-compose.simple.yml logs backend
```

### CORS errors

Make sure `CORS_ORIGINS` in `.env.production` includes your Vercel URL.

### Database connection errors

```bash
# Check PostgreSQL
docker-compose -f docker-compose.simple.yml logs postgres

# Restart everything
docker-compose -f docker-compose.simple.yml restart
```

## 💡 Important Notes

- ⚠️ **HTTP Only**: No SSL certificate (fine for demos)
- ⚠️ **Public IP**: Use `http://YOUR_IP:6000`, not `localhost`
- ⚠️ **CORS**: Must be configured for Vercel domain
- ✅ **Free Vercel**: Frontend is free on Vercel
- ✅ **Low Cost**: VPS costs only $4-6/month

## 🎓 What You Get

- ✅ Fully functional backend API
- ✅ Swagger documentation at `/api`
- ✅ PostgreSQL database with migrations
- ✅ Redis for background jobs
- ✅ BullMQ worker for async tasks
- ✅ Email sending via Resend
- ✅ File uploads to Cloudflare R2
- ✅ Production-ready containers

## 🔗 URLs

After deployment:

- **API**: `http://YOUR_VPS_IP:6000`
- **API Docs**: `http://YOUR_VPS_IP:6000/api`
- **Health**: `http://YOUR_VPS_IP:6000/health`
- **Frontend**: `https://your-app.vercel.app`

Perfect for showcasing your project! 🚀
