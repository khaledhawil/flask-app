#!/bin/bash

# Kubernetes Deployment Script for Islamic Flask App
# This script automates the deployment process with validation and error handling

set -euo pipefail  # Exit on error, undefined vars, and pipe failures

# Configuration
NAMESPACE="islamic-app"
APP_NAME="islamic-flask-app"
IMAGE_NAME="islamic-flask-app"
IMAGE_TAG="${IMAGE_TAG:-latest}"
KUBECTL_TIMEOUT="${KUBECTL_TIMEOUT:-300s}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed or not in PATH"
        exit 1
    fi
    
    # Check if kubectl can connect to cluster
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    
    # Check if Docker is running (for building image)
    if ! docker info &> /dev/null; then
        log_warning "Docker is not running. Skipping image build."
        SKIP_BUILD=true
    fi
    
    log_success "Prerequisites check passed"
}

# Build Docker image
build_image() {
    if [[ "${SKIP_BUILD:-false}" == "true" ]]; then
        log_warning "Skipping image build"
        return
    fi
    
    log_info "Building Docker image..."
    
    # Navigate to app directory
    cd "$(dirname "$0")/.."
    
    # Build the image
    if docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" .; then
        log_success "Docker image built successfully"
    else
        log_error "Failed to build Docker image"
        exit 1
    fi
    
    # Tag for local registry if needed
    if [[ "${USE_LOCAL_REGISTRY:-false}" == "true" ]]; then
        docker tag "${IMAGE_NAME}:${IMAGE_TAG}" "localhost:5000/${IMAGE_NAME}:${IMAGE_TAG}"
        docker push "localhost:5000/${IMAGE_NAME}:${IMAGE_TAG}"
        log_success "Image pushed to local registry"
    fi
}

# Create namespace if it doesn't exist
create_namespace() {
    log_info "Creating namespace if it doesn't exist..."
    
    if kubectl get namespace "${NAMESPACE}" &> /dev/null; then
        log_info "Namespace ${NAMESPACE} already exists"
    else
        kubectl apply -f k8s/namespace.yaml
        log_success "Namespace ${NAMESPACE} created"
    fi
}

# Deploy application
deploy_app() {
    log_info "Deploying application..."
    
    # Apply configurations in order
    local files=(
        "k8s/namespace.yaml"
        "k8s/secrets-and-configs.yaml"
        "k8s/configmap.yaml"
        "k8s/rbac.yaml"
        "k8s/persistent-volume.yaml"
        "k8s/persistent-volume-claim.yaml"
        "k8s/deployment.yaml"
        "k8s/service.yaml"
        "k8s/hpa.yaml"
        "k8s/network-policy.yaml"
        "k8s/monitoring.yaml"
    )
    
    for file in "${files[@]}"; do
        if [[ -f "$file" ]]; then
            log_info "Applying $file..."
            kubectl apply -f "$file"
        else
            log_warning "File $file not found, skipping..."
        fi
    done
    
    log_success "Application manifests applied"
}

# Wait for deployment to be ready
wait_for_deployment() {
    log_info "Waiting for deployment to be ready..."
    
    if kubectl wait --for=condition=available --timeout="${KUBECTL_TIMEOUT}" \
        deployment/islamic-app-deployment -n "${NAMESPACE}"; then
        log_success "Deployment is ready"
    else
        log_error "Deployment failed to become ready within timeout"
        return 1
    fi
}

# Check deployment status
check_deployment_status() {
    log_info "Checking deployment status..."
    
    # Get pod status
    echo "Pods:"
    kubectl get pods -n "${NAMESPACE}" -l app="${APP_NAME}"
    
    # Get service status
    echo -e "\nServices:"
    kubectl get services -n "${NAMESPACE}"
    
    # Get deployment status
    echo -e "\nDeployments:"
    kubectl get deployments -n "${NAMESPACE}"
    
    # Get events
    echo -e "\nRecent Events:"
    kubectl get events -n "${NAMESPACE}" --sort-by=.metadata.creationTimestamp | tail -10
}

# Deploy ingress (optional)
deploy_ingress() {
    if [[ "${DEPLOY_INGRESS:-false}" == "true" ]]; then
        log_info "Deploying ingress..."
        kubectl apply -f k8s/ingress.yaml
        log_success "Ingress deployed"
    else
        log_info "Skipping ingress deployment (set DEPLOY_INGRESS=true to enable)"
    fi
}

# Test deployment
test_deployment() {
    log_info "Testing deployment..."
    
    # Port forward for testing
    local port=8080
    log_info "Port forwarding to localhost:${port} for testing..."
    
    # Start port-forward in background
    kubectl port-forward -n "${NAMESPACE}" service/islamic-app-service "${port}:5000" &
    local pf_pid=$!
    
    # Wait a moment for port-forward to establish
    sleep 5
    
    # Test the application
    if curl -f -s "http://localhost:${port}" > /dev/null; then
        log_success "Application is responding on port ${port}"
    else
        log_error "Application is not responding"
    fi
    
    # Clean up port-forward
    kill $pf_pid 2>/dev/null || true
}

# Rollback function
rollback() {
    log_warning "Rolling back deployment..."
    kubectl rollout undo deployment/islamic-app-deployment -n "${NAMESPACE}"
    wait_for_deployment
    log_success "Rollback completed"
}

# Cleanup function
cleanup() {
    log_info "Cleaning up resources..."
    kubectl delete namespace "${NAMESPACE}" --ignore-not-found=true
    log_success "Cleanup completed"
}

# Show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy     - Deploy the application (default)"
    echo "  build      - Build Docker image only"
    echo "  test       - Test the deployment"
    echo "  status     - Show deployment status"
    echo "  rollback   - Rollback to previous version"
    echo "  cleanup    - Delete all resources"
    echo "  help       - Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  IMAGE_TAG           - Docker image tag (default: latest)"
    echo "  KUBECTL_TIMEOUT     - Timeout for kubectl operations (default: 300s)"
    echo "  DEPLOY_INGRESS      - Deploy ingress (default: false)"
    echo "  USE_LOCAL_REGISTRY  - Use local registry (default: false)"
    echo "  SKIP_BUILD          - Skip Docker build (default: false)"
}

# Main execution
main() {
    local command="${1:-deploy}"
    
    case "$command" in
        "deploy")
            check_prerequisites
            build_image
            create_namespace
            deploy_app
            deploy_ingress
            wait_for_deployment
            check_deployment_status
            test_deployment
            ;;
        "build")
            check_prerequisites
            build_image
            ;;
        "test")
            test_deployment
            ;;
        "status")
            check_deployment_status
            ;;
        "rollback")
            rollback
            ;;
        "cleanup")
            cleanup
            ;;
        "help")
            show_usage
            ;;
        *)
            log_error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
}

# Error handling
trap 'log_error "Script failed on line $LINENO"' ERR

# Run main function
main "$@"
