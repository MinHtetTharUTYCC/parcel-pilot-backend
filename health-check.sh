#!/bin/bash

# Check application health and status

echo "======================================"
echo "Parcel Pilot - Health Check"
echo "======================================"

# Check Docker containers
echo ""
echo "1. Docker Containers Status:"
docker-compose ps

# Check API health endpoint
echo ""
echo "2. API Health Check:"
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ "$API_RESPONSE" == "200" ]; then
    echo "✓ API is healthy (HTTP $API_RESPONSE)"
else
    echo "✗ API is unhealthy (HTTP $API_RESPONSE)"
fi

# Check disk space
echo ""
echo "3. Disk Space:"
df -h / | awk 'NR==2 {print "Used: " $3 " / " $2 " (" $5 ")"}'

# Check memory
echo ""
echo "4. Memory Usage:"
free -h | awk 'NR==2 {print "Used: " $3 " / " $2}'

# Check container logs (last 10 lines)
echo ""
echo "5. Recent API Logs:"
docker-compose logs --tail=10 api

echo ""
echo "======================================"
echo "Health check complete"
echo "======================================"
