#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Parcel Pilot Backend Deployment${NC}"
echo -e "${GREEN}=====================================${NC}"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}Error: .env.production file not found${NC}"
    echo -e "${YELLOW}Please copy .env.production.example to .env.production and configure it${NC}"
    exit 1
fi

# Stop and remove existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker-compose down

# Build fresh images
echo -e "${YELLOW}Building Docker images...${NC}"
docker-compose build --no-cache

# Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
docker-compose run --rm api npx prisma migrate deploy

# Start all services
echo -e "${YELLOW}Starting services...${NC}"
docker-compose up -d

# Show status
echo -e "${GREEN}Checking service status...${NC}"
docker-compose ps

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "API: http://localhost:3000"
echo -e "API Docs: http://localhost:3000/api"
echo -e ""
echo -e "To view logs: ${YELLOW}docker-compose logs -f${NC}"
echo -e "To stop: ${YELLOW}docker-compose down${NC}"
