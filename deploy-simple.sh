#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}🚀 Parcel Pilot - Simple Deployment${NC}"
echo -e "${GREEN}=====================================${NC}"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}Error: .env.production file not found${NC}"
    echo -e "${YELLOW}Please create it first${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker not found. Installing...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}Docker installed. Please log out and log back in, then run this script again.${NC}"
    exit 0
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Docker Compose not found. Installing...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Stop existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker-compose -f docker-compose.simple.yml down

# Build fresh images
echo -e "${YELLOW}Building Docker images...${NC}"
docker-compose -f docker-compose.simple.yml build --no-cache

# Start services
echo -e "${YELLOW}Starting services...${NC}"
docker-compose -f docker-compose.simple.yml up -d

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 15

# Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
docker-compose -f docker-compose.simple.yml exec -T backend npx prisma migrate deploy

# Show status
echo -e "${GREEN}Checking service status...${NC}"
docker-compose -f docker-compose.simple.yml ps

# Get public IP
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || echo "Unable to detect")

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e ""
echo -e "${BLUE}Your API is running at:${NC}"
echo -e "  ${YELLOW}http://${PUBLIC_IP}:6000${NC}"
echo -e ""
echo -e "${BLUE}Endpoints:${NC}"
echo -e "  Health: ${YELLOW}http://${PUBLIC_IP}:6000/health${NC}"
echo -e "  API Docs: ${YELLOW}http://${PUBLIC_IP}:6000/api${NC}"
echo -e ""
echo -e "${BLUE}Useful commands:${NC}"
echo -e "  View logs: ${YELLOW}docker-compose -f docker-compose.simple.yml logs -f${NC}"
echo -e "  Stop: ${YELLOW}docker-compose -f docker-compose.simple.yml down${NC}"
echo -e "  Restart: ${YELLOW}docker-compose -f docker-compose.simple.yml restart${NC}"
echo -e ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Update .env.production with BACKEND_URL=http://${PUBLIC_IP}:6000"
echo -e "  2. Deploy frontend to Vercel"
echo -e "  3. Update FRONTEND_URL in .env.production with your Vercel URL"
echo -e "  4. Restart: ${YELLOW}docker-compose -f docker-compose.simple.yml restart backend${NC}"
