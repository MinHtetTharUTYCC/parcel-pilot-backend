# 🚀 VPS Deployment - Ready to Deploy!

Your backend is now fully prepared for deployment to Digital Ocean VPS.

## 📦 What's Been Prepared

### Core Files

✅ **docker-compose.yml** - Production-ready with health checks, restart policies  
✅ **Dockerfile** - Multi-stage build, non-root user, optimized for production  
✅ **.env.production.example** - Complete environment template  
✅ **.dockerignore** - Optimized Docker builds

### Deployment Scripts

✅ **deploy.sh** - Full deployment script (initial setup & major updates)  
✅ **update.sh** - Quick update for code changes  
✅ **backup.sh** - Automated database backups  
✅ **health-check.sh** - System health monitoring

### Configuration

✅ **nginx.conf** - Reverse proxy with SSL, security headers  
✅ **.github/workflows/deploy.yml** - CI/CD automation (optional)

### Documentation

✅ **DEPLOYMENT_GUIDE.md** - Complete step-by-step deployment guide  
✅ **QUICK_REFERENCE.md** - Common commands and operations  
✅ **PRE_DEPLOYMENT_CHECKLIST.md** - Pre-flight checklist  
✅ **ALTERNATIVE_PM2_DEPLOYMENT.md** - Non-Docker option

## 🎯 Next Steps

### 1. Prepare Your VPS

```bash
# SSH into your Digital Ocean droplet
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Install Nginx
apt install nginx -y

# Install Certbot (SSL)
apt install certbot python3-certbot-nginx -y
```

### 2. Setup Application

```bash
# Clone repository
cd /root
git clone <your-repo-url> parcel-pilot
cd parcel-pilot/backend

# Configure environment
cp .env.production.example .env.production
nano .env.production  # Edit all variables
```

### 3. Configure Domain & SSL

```bash
# Copy nginx config
cp nginx.conf /etc/nginx/sites-available/parcel-pilot

# Edit domain name
nano /etc/nginx/sites-available/parcel-pilot

# Enable site
ln -s /etc/nginx/sites-available/parcel-pilot /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Get SSL certificate
certbot --nginx -d yourdomain.com
```

### 4. Deploy!

```bash
chmod +x *.sh
./deploy.sh
```

### 5. Verify

```bash
./health-check.sh
curl https://yourdomain.com/health
curl https://yourdomain.com/api  # Swagger docs
```

## 🔐 Critical Environment Variables

You MUST configure these in `.env.production`:

| Variable               | How to Get                          | Required |
| ---------------------- | ----------------------------------- | -------- |
| `POSTGRES_PASSWORD`    | Generate: `openssl rand -base64 32` | ✅       |
| `JWT_SECRET`           | Generate: `openssl rand -base64 32` | ✅       |
| `R2_ACCOUNT_ID`        | Cloudflare R2 Dashboard             | ✅       |
| `R2_ACCESS_KEY_ID`     | Cloudflare R2 API Tokens            | ✅       |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 API Tokens            | ✅       |
| `R2_BUCKET_NAME`       | Create bucket in R2                 | ✅       |
| `R2_PUBLIC_URL`        | R2 bucket public URL                | ✅       |
| `RESEND_API_KEY`       | Resend.com Dashboard                | ✅       |
| `RESEND_FROM_EMAIL`    | Your verified domain                | ✅       |
| `CORS_ORIGIN`          | Your frontend URL                   | ✅       |
| `COOKIE_DOMAIN`        | Your domain                         | ✅       |

## 📊 Architecture Overview

```
Internet
   │
   ▼
[Nginx :80/443] ← SSL Certificate
   │
   ▼
[API Container :3000]
   │
   ├─→ [Worker Container] → [Redis Container]
   │
   └─→ [PostgreSQL Container]
```

## 🎯 Features Included

✅ **Security**

- Non-root Docker user
- Health checks for all services
- SSL/TLS encryption
- Security headers in Nginx
- Environment isolation

✅ **Reliability**

- Automatic container restart
- Database health monitoring
- Redis connection pooling
- Graceful shutdown handling

✅ **Maintenance**

- Automated backups
- Easy updates
- Health monitoring
- Log management

✅ **Performance**

- Multi-stage Docker builds
- Nginx reverse proxy
- Container resource limits
- Optimized image sizes

## 📝 Daily Operations

### View Logs

```bash
docker-compose logs -f api
docker-compose logs -f worker
```

### Update Code

```bash
git pull
./update.sh
```

### Backup Database

```bash
./backup.sh
```

### Check Health

```bash
./health-check.sh
```

### Restart Services

```bash
docker-compose restart api
docker-compose restart worker
```

## 🆘 Troubleshooting

### Containers won't start

```bash
docker-compose logs
docker-compose down
docker system prune -a
./deploy.sh
```

### Out of memory

```bash
free -h
docker stats
# Consider upgrading droplet size
```

### Database connection issues

```bash
docker-compose exec postgres pg_isready
docker-compose logs postgres
```

### SSL certificate issues

```bash
sudo certbot renew --dry-run
sudo certbot renew
```

## 📚 Important Files Locations

- Application: `/root/parcel-pilot/backend`
- Nginx config: `/etc/nginx/sites-available/parcel-pilot`
- SSL certs: `/etc/letsencrypt/live/yourdomain.com/`
- Logs: `docker-compose logs` or `/var/log/nginx/`
- Backups: `/root/parcel-pilot-backups/`

## ✅ Post-Deployment Checklist

- [ ] Application responding at `https://yourdomain.com`
- [ ] Swagger docs accessible at `https://yourdomain.com/api`
- [ ] Health check returning 200 OK
- [ ] SSL certificate valid and auto-renewal configured
- [ ] Database migrations completed
- [ ] Worker processing jobs
- [ ] Email sending working
- [ ] File uploads to R2 working
- [ ] Backups scheduled (cron job)
- [ ] Monitoring configured
- [ ] Firewall rules active

## 🎓 Learn More

- Read [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions
- Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for command reference
- Review [PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md) before starting

## 💡 Tips

1. **Always test locally first** with `docker-compose up` before deploying
2. **Keep backups** - Run `./backup.sh` daily (set up cron job)
3. **Monitor logs** - Check logs regularly for errors
4. **Update regularly** - Keep dependencies and system updated
5. **Use staging** - Test updates on staging before production

## 🔗 Useful Commands Quick Reference

```bash
# Deploy
./deploy.sh

# Update
./update.sh

# Health
./health-check.sh

# Backup
./backup.sh

# Logs
docker-compose logs -f

# Status
docker-compose ps

# Restart
docker-compose restart api worker
```

## 🌟 You're All Set!

Everything is configured and ready. Follow the steps in order, and you'll have your backend running on Digital Ocean in about 30 minutes.

Good luck with your deployment! 🚀

---

**Created:** January 20, 2026  
**For:** Parcel Pilot Backend  
**Platform:** Digital Ocean VPS  
**Stack:** NestJS + PostgreSQL + Redis + Docker
