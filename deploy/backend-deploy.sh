#!/bin/bash

# Backend Deployment Script
# This script runs ON YOUR SERVER
# Place it at: /opt/deploy/backend-deploy.sh

set -e  # Exit on error

# Configuration
CONTAINER_NAME="backend"
# Image name - can be overridden with environment variable
IMAGE_NAME="${DOCKER_IMAGE:-ghcr.io/$(whoami)/backend:latest}"
ENV_FILE="/opt/deploy/.env.backend"
PORT="7001"  # External port
INTERNAL_PORT="7001"  # Container port
NETWORK="gridsports-network"

echo "🚀 Starting deployment of Backend..."
echo "📦 Using image: ${IMAGE_NAME}"

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

# Create network if it doesn't exist
if ! docker network ls --format '{{.Name}}' | grep -q "^${NETWORK}$"; then
    echo "🌐 Creating Docker network: ${NETWORK}"
    docker network create ${NETWORK}
fi

# Start new container
echo "🎬 Starting new container..."
docker run -d \
  --name ${CONTAINER_NAME} \
  --restart unless-stopped \
  -p ${PORT}:${INTERNAL_PORT} \
  --env-file ${ENV_FILE} \
  --network ${NETWORK} \
  --health-cmd="node -e \"require('http').get('http://localhost:7001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})\"" \
  --health-interval=30s \
  --health-timeout=3s \
  --health-retries=3 \
  --health-start-period=40s \
  ${IMAGE_NAME}

# Wait for container to be healthy
echo "⏳ Waiting for container to be healthy..."
TIMEOUT=60
ELAPSED=0

while [ $ELAPSED -lt $TIMEOUT ]; do
    HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' ${CONTAINER_NAME} 2>/dev/null || echo "starting")
    
    if [ "$HEALTH_STATUS" = "healthy" ]; then
        echo "✅ Container is healthy!"
        docker ps | grep ${CONTAINER_NAME}
        echo "🎉 Deployment successful!"
        exit 0
    elif [ "$HEALTH_STATUS" = "unhealthy" ]; then
        echo "❌ Container is unhealthy!"
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
