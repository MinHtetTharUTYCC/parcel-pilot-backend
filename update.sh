#!/bin/bash

# Quick update script - for small updates without rebuilding images
# Use this when you only change code, not dependencies

echo "Pulling latest changes..."
git pull origin main

echo "Stopping containers..."
docker-compose stop api worker

echo "Rebuilding application..."
docker-compose build api worker

echo "Running migrations..."
docker-compose run --rm api npx prisma migrate deploy

echo "Starting containers..."
docker-compose up -d api worker

echo "Checking status..."
docker-compose ps

echo "Update complete!"
