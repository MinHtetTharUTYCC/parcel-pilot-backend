#!/bin/bash

# Quick update script - for small updates without rebuilding images
# Use when only code changes, not dependencies

echo "Pulling latest changes..."
git pull origin main

echo "Stopping containers..."
docker-compose stop backend

echo "Rebuilding application..."
docker-compose build backend

echo "Running migrations..."
docker-compose run --rm backend npx prisma migrate deploy

echo "Starting containers..."
docker-compose up -d backend

echo "Checking status..."
docker-compose ps

echo "Update complete!"
