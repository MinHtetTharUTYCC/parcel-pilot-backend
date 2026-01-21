# Pre-Deployment Checklist

Complete this checklist before deploying to your Digital Ocean VPS.

## ✅ Server Requirements

- [ ] Digital Ocean Droplet created (minimum 2GB RAM recommended)
- [ ] Ubuntu 22.04 LTS or later installed
- [ ] Root or sudo access available
- [ ] SSH key configured for secure access
- [ ] Domain name purchased and configured
- [ ] DNS A record pointing to VPS IP address

## ✅ Required Services/Accounts

- [ ] **Cloudflare R2** account setup
  - [ ] R2 bucket created
  - [ ] Access key and secret key obtained
  - [ ] Bucket name recorded
- [ ] **Resend** account setup
  - [ ] Domain verified for sending emails
  - [ ] API key generated
  - [ ] Sender email address verified

## ✅ Local Preparation

- [ ] Code pushed to Git repository
- [ ] All tests passing locally
- [ ] Environment variables documented
- [ ] Database schema finalized

## ✅ Security Preparation

- [ ] Strong JWT secret generated (`openssl rand -base64 32`)
- [ ] Strong database password generated
- [ ] All API keys and secrets ready
- [ ] Firewall rules planned

## ✅ Configuration Files

- [ ] `.env.production` created from `.env.production.example`
- [ ] `DATABASE_URL` password changed
- [ ] `POSTGRES_PASSWORD` matches DATABASE_URL
- [ ] `JWT_SECRET` set to generated secret
- [ ] `R2_*` variables configured
- [ ] `RESEND_*` variables configured
- [ ] `CORS_ORIGIN` set to frontend domain
- [ ] `COOKIE_DOMAIN` set correctly
- [ ] `nginx.conf` domain names updated

## ✅ VPS Initial Setup

- [ ] Server updated (`apt update && apt upgrade`)
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Nginx installed
- [ ] Certbot installed (for SSL)
- [ ] Firewall configured (ufw)
- [ ] User added to docker group

## ✅ Deployment Files Ready

- [ ] `deploy.sh` - Main deployment script
- [ ] `update.sh` - Quick update script
- [ ] `backup.sh` - Database backup script
- [ ] `health-check.sh` - Health monitoring script
- [ ] `docker-compose.yml` - Container orchestration
- [ ] `Dockerfile` - Container image definition
- [ ] `nginx.conf` - Reverse proxy configuration
- [ ] `.dockerignore` - Docker build optimization

## ✅ Documentation Review

- [ ] Read `DEPLOYMENT_GUIDE.md`
- [ ] Review `QUICK_REFERENCE.md`
- [ ] Understand backup procedures
- [ ] Know how to check logs
- [ ] Familiar with rollback process

## ✅ Testing Plan

- [ ] Health endpoint test planned
- [ ] API documentation access confirmed
- [ ] Authentication flow tested
- [ ] File upload (R2) tested
- [ ] Email sending tested
- [ ] Database migrations verified

## ✅ Monitoring & Maintenance

- [ ] Log monitoring strategy planned
- [ ] Backup schedule decided (recommend daily)
- [ ] Update procedure understood
- [ ] Rollback procedure documented
- [ ] Contact list for incidents prepared

## ✅ Post-Deployment

- [ ] SSL certificate obtained with Certbot
- [ ] Health check passing
- [ ] API documentation accessible
- [ ] All endpoints responding
- [ ] Database migrations completed
- [ ] Background worker running
- [ ] Email sending working
- [ ] File uploads working
- [ ] CORS configured correctly
- [ ] Logs showing no errors

## ✅ Optional but Recommended

- [ ] Monitoring service setup (e.g., UptimeRobot)
- [ ] Error tracking (e.g., Sentry)
- [ ] Analytics configured
- [ ] GitHub Actions workflow configured for CI/CD
- [ ] Staging environment created
- [ ] Load testing performed
- [ ] Documentation for team members

## Quick Start Command Sequence

Once all above items are checked:

```bash
# On VPS
git clone <your-repo> parcel-pilot
cd parcel-pilot/backend
cp .env.production.example .env.production
nano .env.production  # Configure all variables
./deploy.sh           # Initial deployment
./health-check.sh     # Verify everything is working
```

## Emergency Contacts

- VPS Provider Support: ********\_********
- Domain Registrar: ********\_********
- Team Lead: ********\_********
- DevOps Contact: ********\_********

## Notes

_Add any specific notes for your deployment here_

---

**Last Updated:** January 20, 2026
**Prepared By:** ******\_\_\_******
**Reviewed By:** ******\_\_\_******
