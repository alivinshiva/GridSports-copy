#!/bin/bash

# Nginx Reverse Proxy Deployment Script
# This script runs ON YOUR SERVER
# Place it at: /opt/deploy/nginx-deploy.sh

set -e  # Exit on error

# Configuration
CONTAINER_NAME="nginx-proxy"
IMAGE_NAME="nginx:alpine"
NGINX_CONF="/opt/deploy/nginx.conf"
PORT_HTTP="80"
PORT_HTTPS="443"
NETWORK="gridsports-network"

echo "🚀 Starting deployment of Nginx Reverse Proxy..."

# Check if nginx config exists
if [ ! -f "$NGINX_CONF" ]; then
    echo "❌ Nginx config not found at: $NGINX_CONF"
    echo "Please upload nginx.conf first"
    exit 1
fi

# Check if old container exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "📦 Found existing container: ${CONTAINER_NAME}"
    
    # Check if it's running
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo "🛑 Stopping old container..."
        docker stop ${CONTAINER_NAME}
    fi
    
    echo "🗑️  Removing old container..."
    docker rm ${CONTAINER_NAME}
else
    echo "ℹ️  No existing container found"
fi

# Pull latest nginx image
echo "📥 Pulling latest nginx image..."
docker pull ${IMAGE_NAME}

# Create network if it doesn't exist
if ! docker network ls --format '{{.Name}}' | grep -q "^${NETWORK}$"; then
    echo "🌐 Creating Docker network: ${NETWORK}"
    docker network create ${NETWORK}
fi

# Start new container
echo "🎬 Starting new nginx container..."
docker run -d \
  --name ${CONTAINER_NAME} \
  --restart unless-stopped \
  -p ${PORT_HTTP}:80 \
  -p ${PORT_HTTPS}:443 \
  -v ${NGINX_CONF}:/etc/nginx/conf.d/default.conf:ro \
  --network ${NETWORK} \
  --health-cmd="wget --quiet --tries=1 --spider http://localhost/health || exit 1" \
  --health-interval=30s \
  --health-timeout=3s \
  --health-retries=3 \
  --health-start-period=10s \
  ${IMAGE_NAME}

# Wait for container to be healthy
echo "⏳ Waiting for container to be healthy..."
TIMEOUT=30
ELAPSED=0

while [ $ELAPSED -lt $TIMEOUT ]; do
    HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' ${CONTAINER_NAME} 2>/dev/null || echo "starting")
    
    if [ "$HEALTH_STATUS" = "healthy" ]; then
        echo "✅ Nginx is healthy!"
        docker ps | grep ${CONTAINER_NAME}
        echo "🎉 Deployment successful!"
        echo ""
        echo "📍 Nginx is now proxying:"
        echo "   ├─ / → frontend (port 3001)"
        echo "   ├─ /api/ → backend (port 4000)"
        echo "   └─ /ad-api/ → adbackend (port 3000)"
        exit 0
    elif [ "$HEALTH_STATUS" = "unhealthy" ]; then
        echo "❌ Nginx is unhealthy!"
        echo "📋 Last 50 lines of logs:"
        docker logs ${CONTAINER_NAME} --tail 50
        exit 1
    fi
    
    echo "   Health status: ${HEALTH_STATUS} (${ELAPSED}s/${TIMEOUT}s)"
    sleep 5
    ELAPSED=$((ELAPSED + 5))
done

echo "⚠️  Timeout waiting for container to be healthy"
echo "📋 Container logs:"
docker logs ${CONTAINER_NAME} --tail 50
exit 1
