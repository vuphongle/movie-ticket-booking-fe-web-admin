#!/bin/bash

set -e

echo "🚀 Starting Frontend Deployment..."

# Configuration
IMAGE_NAME="vuphongle23/movie-ticket-booking-fe-admin:latest"
CONTAINER_NAME="movie-booking-frontend-admin"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📥 Pulling latest frontend image from Docker Hub...${NC}"
docker pull $IMAGE_NAME

echo -e "${YELLOW}🔄 Stopping existing frontend container...${NC}"
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
docker image prune -f

echo -e "${YELLOW}🚀 Starting frontend container...${NC}"
docker run -d \
  --name $CONTAINER_NAME \
  --network movie-ticket-booking-be_movie-booking-network \
  -p 80:80 \
  --restart unless-stopped \
  $IMAGE_NAME

echo -e "${YELLOW}⏳ Waiting for frontend to be ready...${NC}"
sleep 5

# Check if frontend is running
if docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${GREEN}✅ Frontend container is running${NC}"
    docker ps | grep $CONTAINER_NAME
else
    echo -e "${RED}❌ Frontend container failed to start${NC}"
    docker logs $CONTAINER_NAME
    exit 1
fi

# Show logs
echo -e "${YELLOW}📋 Recent logs:${NC}"
docker logs --tail=50 $CONTAINER_NAME

echo -e "${GREEN}✅ Frontend deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Application should be available at http://your-server${NC}"
echo -e "${GREEN}🌐 Or http://$(hostname -I | awk '{print $1}')${NC}"
