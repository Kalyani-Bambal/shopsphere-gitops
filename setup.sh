#!/bin/bash

# ShopSphere GitOps - Quick Start Script

set -e

echo "🚀 ShopSphere GitOps Setup"
echo "=========================="

# Check prerequisites
check_prereqs() {
    echo "Checking prerequisites..."
    
    command -v docker >/dev/null 2>&1 || { echo "❌ Docker not found"; exit 1; }
    command -v kubectl >/dev/null 2>&1 || { echo "❌ Kubectl not found"; exit 1; }
    command -v minikube >/dev/null 2>&1 || { echo "❌ Minikube not found"; exit 1; }
    
    echo "✅ All prerequisites installed"
}

# Start Minikube
start_minikube() {
    echo ""
    echo "Starting Minikube..."
    minikube start --driver=docker --memory=4096 --cpus=2 || true
    eval "$(minikube docker-env)"
    echo "✅ Minikube started"
}

# Build Docker images
build_images() {
    echo ""
    echo "Building Docker images..."
    docker build -t shopsphere-backend:latest ./backend
    echo "✅ Backend image built"
    
    docker build -t shopsphere-frontend:latest ./frontend
    echo "✅ Frontend image built"
}

# Deploy to Kubernetes
deploy_k8s() {
    echo ""
    echo "Deploying to Kubernetes..."
    
    kubectl create namespace dev --dry-run=client -o yaml | kubectl apply -f -
    echo "✅ Namespace created"
    
    kubectl apply -f k8s/namespace.yaml
    kubectl apply -f k8s/backend.yaml
    kubectl apply -f k8s/frontend.yaml
    echo "✅ Applications deployed"
}

# Wait for deployments
wait_deployments() {
    echo ""
    echo "Waiting for deployments to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/backend -n dev || true
    kubectl wait --for=condition=available --timeout=300s deployment/frontend -n dev || true
    echo "✅ Deployments ready"
}

# Show access information
show_info() {
    echo ""
    echo "=========================="
    echo "✨ ShopSphere is Ready! ✨"
    echo "=========================="
    echo ""
    
    MINIKUBE_IP=$(minikube ip)
    echo "Minikube IP: $MINIKUBE_IP"
    echo "Frontend URL: http://$MINIKUBE_IP:30007"
    echo ""
    echo "Backend API: http://backend-service:5000 (within cluster)"
    echo ""
    echo "Useful commands:"
    echo "  kubectl logs -f deployment/backend -n dev"
    echo "  kubectl logs -f deployment/frontend -n dev"
    echo "  kubectl port-forward -n dev svc/frontend-service 3000:3000"
    echo ""
}

# Main execution
main() {
    check_prereqs
    start_minikube
    build_images
    deploy_k8s
    wait_deployments
    show_info
}

main
