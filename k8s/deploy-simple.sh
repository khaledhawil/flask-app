#!/bin/bash

# Simple deployment script for Islamic Flask App
# This script builds the Docker image and applies Kubernetes manifests in the correct order

set -e

# Configuration
DOCKER_IMAGE="khaledhawil/flask-app:latest"
NAMESPACE="islamic-app"

# Check if cleanup flag is provided
if [[ "$1" == "--cleanup" || "$1" == "-c" ]]; then
    echo "🧹 Cleaning up existing deployment..."
    kubectl delete namespace $NAMESPACE --ignore-not-found=true
    echo "⏳ Waiting for namespace deletion..."
    sleep 5
    echo "✅ Cleanup completed"
fi

echo "🚀 Starting Islamic Flask App deployment..."

# Step 0: Build Docker image (skip if --no-build flag is provided)
if [[ "$1" != "--no-build" && "$2" != "--no-build" ]]; then
    echo "🐳 Building Docker image: $DOCKER_IMAGE"
    cd ..
    docker build -t $DOCKER_IMAGE .
    echo "✅ Docker image built successfully"
    cd k8s
else
    echo "⏭️  Skipping Docker image build (using existing image: $DOCKER_IMAGE)"
fi

# Step 1: Create namespace first
echo "📁 Creating namespace..."
kubectl apply -f namespace.yaml

# Wait for namespace to be ready
sleep 2

# Step 2: Apply basic resources
echo "🔧 Applying basic configuration..."
kubectl apply -f configmap.yaml
kubectl apply -f persistent-volume.yaml
kubectl apply -f persistent-volume-claim.yaml

# Step 3: Apply RBAC (if exists)
if [[ -f "rbac.yaml" ]]; then
    echo "🔐 Applying RBAC..."
    kubectl apply -f rbac.yaml
fi

# Step 4: Deploy the application
echo "🏗️ Deploying application..."
kubectl apply -f deployment.yaml

# Step 5: Create services
echo "🌐 Creating services..."
kubectl apply -f service.yaml

# Step 6: Apply HPA
echo "📊 Applying HPA..."
kubectl apply -f hpa.yaml

# Step 7: Apply ingress
echo "🔗 Applying ingress..."
kubectl apply -f ingress.yaml

# Step 8: Apply network policy (only if NetworkPolicy is supported)
echo "🛡️ Applying network policy..."
if kubectl api-resources | grep -q "networkpolicies.*networking.k8s.io"; then
    kubectl apply -f network-policy.yaml || echo "⚠️  Failed to apply network policy, continuing..."
    echo "✅ Network policy applied"
else
    echo "⚠️  NetworkPolicy not supported in this cluster, skipping..."
fi

# Step 9: Apply monitoring (only if Prometheus operator is installed)
echo "📈 Applying monitoring..."
if kubectl api-resources | grep -q "servicemonitors.*monitoring.coreos.com"; then
    kubectl apply -f monitoring.yaml || echo "⚠️  Failed to apply monitoring, continuing..."
    echo "✅ Monitoring applied"
else
    echo "⚠️  Prometheus operator not installed, skipping monitoring setup..."
    echo "💡 To install Prometheus operator:"
    echo "   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts"
    echo "   helm install prometheus prometheus-community/kube-prometheus-stack"
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "🐳 Docker Image: $DOCKER_IMAGE"
echo "📦 Namespace: $NAMESPACE"
echo ""
echo "📋 Access your application:"
echo "   NodePort: http://<node-ip>:30001"
echo "   Port Forward: kubectl port-forward -n $NAMESPACE service/islamic-app-service 5000:5000"
echo ""
echo "🔍 Check deployment status:"
echo "   kubectl get all -n $NAMESPACE"
echo "   kubectl get pods -n $NAMESPACE -w"
echo ""
echo "📊 View logs:"
echo "   kubectl logs -n $NAMESPACE -l app=islamic-flask-app -f"
echo ""
echo "💡 Usage options:"
echo "   ./deploy-simple.sh                 # Full deployment with image build"
echo "   ./deploy-simple.sh --no-build      # Deploy without building image"
echo "   ./deploy-simple.sh --cleanup       # Clean up and redeploy"
echo "   ./build-image.sh --push            # Build and push image to Docker Hub"
echo ""
