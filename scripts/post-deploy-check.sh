#!/bin/bash

# Post-deployment health check script
# This ensures all services are running after admin deployment

set -e

echo "🔍 Starting post-deployment health check..."

# Check if user frontend is running
if ! docker ps | grep -q movie-booking-frontend-user; then
    echo "⚠️  User frontend container is not running!"
    echo "🔄 Attempting to restart user frontend..."
    
    cd /opt/movie-ticket-booking-fe-user
    docker stop movie-booking-frontend-user || true
    docker rm -f movie-booking-frontend-user || true
    docker compose up -d frontend-user
    sleep 3
fi

# Check if nginx proxy is running
if ! docker ps | grep -q gocinema-nginx-proxy; then
    echo "⚠️  Nginx proxy container is not running!"
    echo "🔄 Attempting to restart nginx proxy..."
    
    docker restart gocinema-nginx-proxy || true
    sleep 3
fi

# Verify all containers are healthy
echo "📊 Container status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "movie-booking-frontend|gocinema-nginx"

# Test connectivity
echo ""
echo "🏥 Testing connectivity..."
echo -n "Admin (port 8081): "
curl -f -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:8081 || echo "FAILED"

echo -n "User (port 3000): "
curl -f -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3000 || echo "FAILED"

echo -n "Nginx proxy (port 80): "
curl -f -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost || echo "FAILED"

echo ""
echo "✅ Post-deployment health check completed!"
