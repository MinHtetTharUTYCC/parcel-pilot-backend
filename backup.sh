#!/bin/bash

# Backup script for database

BACKUP_DIR="/home/$USER/parcel-pilot-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "Creating backup: $BACKUP_FILE"

# Create backup
docker-compose exec -T postgres pg_dump -U parcel_pilot parcel_pilot > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

echo "Backup created: ${BACKUP_FILE}.gz"

# Keep only last 7 backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Old backups cleaned up. Keeping only last 7 days."
