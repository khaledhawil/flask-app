#!/bin/bash

# Docker image builder for Islamic Flask App
set -e

# Configuration
DOCKER_IMAGE="islamic-flask-app:latest"

echo "🐳 Building Docker image for Islamic Flask App..."
echo "📦 Image name: $DOCKER_IMAGE"

# Navigate to project root
cd ..

# Build the Docker image
echo "🔨 Building image..."
docker build -t $DOCKER_IMAGE .

echo ""
echo "✅ Docker image built successfully!"
echo "🐳 Image: $DOCKER_IMAGE"
echo ""
echo "🔍 Verify image:"
echo "   docker images | grep islamic-flask-app"
echo ""
echo "🚀 Test locally:"
echo "   docker run -p 5000:5000 $DOCKER_IMAGE"
echo ""
