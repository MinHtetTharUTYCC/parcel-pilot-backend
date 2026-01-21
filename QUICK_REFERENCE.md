# Quick Reference - Deployment Commands

## Initial Setup

```bash
# 1. Copy environment file
cp .env.production.example .env.production
nano .env.production  # Edit with your values

# 2. Make scripts executable
chmod +x deploy.sh update.sh backup.sh health-check.sh

# 3. Initial deployment
./deploy.sh
```

## Daily Operations

### Deploy/Update

```bash
./deploy.sh          # Full deployment (rebuilds everything)
./update.sh          # Quick update (for code changes only)
```

### Monitoring

```bash
./health-check.sh    # Check system health
docker-compose ps    # Check container status
docker-compose logs -f api    # View API logs
docker-compose logs -f worker # View worker logs
docker stats         # Resource usage
```

### Database

```bash
./backup.sh          # Create database backup
docker-compose exec postgres psql -U parcel_pilot parcel_pilot  # Access DB
docker-compose run --rm api npx prisma migrate deploy  # Run migrations
docker-compose run --rm api npx prisma studio  # Open Prisma Studio
```

### Container Management

```bash
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose restart api        # Restart API
docker-compose restart worker     # Restart worker
docker-compose exec api sh        # Access API container shell
```

## Environment Variables Required

| Variable               | Description                  | Example                                   |
| ---------------------- | ---------------------------- | ----------------------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string | `postgresql://user:pass@postgres:5432/db` |
| `JWT_SECRET`           | Secret for JWT tokens        | Generate with `openssl rand -base64 32`   |
| `REDIS_HOST`           | Redis hostname               | `redis` (from docker-compose)             |
| `R2_ACCOUNT_ID`        | Cloudflare R2 account ID     | Your R2 account ID                        |
| `R2_ACCESS_KEY_ID`     | R2 access key                | Your R2 access key                        |
| `R2_SECRET_ACCESS_KEY` | R2 secret key                | Your R2 secret key                        |
| `R2_BUCKET_NAME`       | R2 bucket name               | `parcel-pilot-uploads`                    |
| `RESEND_API_KEY`       | Resend email API key         | `re_xxxxx`                                |
| `RESEND_FROM_EMAIL`    | Verified sender email        | `noreply@yourdomain.com`                  |
| `CORS_ORIGIN`          | Frontend domain              | `https://yourdomain.com`                  |
| `COOKIE_DOMAIN`        | Cookie domain                | `yourdomain.com`                          |

## Nginx Commands

```bash
sudo nginx -t                     # Test configuration
sudo systemctl reload nginx       # Reload nginx
sudo systemctl restart nginx      # Restart nginx
sudo certbot renew               # Renew SSL certificate
```

## Troubleshooting

### Container won't start

```bash
docker-compose logs api          # Check logs
docker-compose down              # Stop everything
docker system prune -a           # Clean up (careful!)
./deploy.sh                      # Redeploy
```

### Database issues

```bash
docker-compose exec postgres pg_isready -U parcel_pilot
docker-compose logs postgres
```

### Out of disk space

```bash
df -h                            # Check disk usage
docker system prune -a --volumes # Clean up Docker
```

## Security Checklist

- [ ] Changed database password in `.env.production`
- [ ] Set strong `JWT_SECRET`
- [ ] Configured firewall (`ufw`)
- [ ] SSL certificate installed
- [ ] Regular backups configured (cron job)
- [ ] Environment variables secured
- [ ] Nginx configured with security headers

## Setup Cron Jobs

```bash
crontab -e
```

Add these lines:

```cron
# Backup database daily at 2 AM
0 2 * * * /home/$USER/parcel-pilot/backend/backup.sh >> /home/$USER/backup.log 2>&1

# Health check every hour
0 * * * * /home/$USER/parcel-pilot/backend/health-check.sh >> /home/$USER/health.log 2>&1

# SSL renewal check (runs twice daily)
0 0,12 * * * certbot renew --quiet
```

## Important URLs

- API: `https://your-domain.com`
- API Docs: `https://your-domain.com/api`
- Health: `https://your-domain.com/health`

## Support Commands

```bash
# View real-time logs
docker-compose logs -f

# Resource usage
docker stats

# Restart everything
docker-compose restart

# Full reset (caution: loses data!)
docker-compose down -v
./deploy.sh
```
