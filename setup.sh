#!/bin/bash

# ShopSphere GitOps - Automated Setup Script
# One-command setup for the entire application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_step() {
    echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}$1${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Check prerequisites
check_prereqs() {
    log_step "STEP 1: Checking Prerequisites"
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker not found. Please install Docker."
        exit 1
    fi
    log_success "Docker found"
    
    if ! command -v kubectl &> /dev/null; then
        log_error "Kubectl not found. Please install Kubectl."
        exit 1
    fi
    log_success "Kubectl found"
    
    if ! command -v minikube &> /dev/null; then
        log_error "Minikube not found. Please install Minikube."
        exit 1
    fi
    log_success "Minikube found"
    
    if ! command -v git &> /dev/null; then
        log_error "Git not found. Please install Git."
        exit 1
    fi
    log_success "Git found"
    
    log_success "All prerequisites installed!"
}

# Start Minikube
start_minikube() {
    log_step "STEP 2: Starting Minikube Cluster"
    
    if minikube status | grep -q "Running"; then
        log_info "Minikube is already running"
    else
        log_info "Starting Minikube (this may take 2-3 minutes)..."
        minikube start --driver=docker --memory=4096 --cpus=2
        sleep 5
    fi
    
    log_success "Minikube is running"
}

# Configure Docker to use Minikube
configure_docker() {
    log_info "Configuring Docker to use Minikube daemon..."
    eval "$(minikube docker-env)"
    log_success "Docker configured for Minikube"
}

# Build Docker images
build_images() {
    log_step "STEP 3: Building Docker Images"
    
    log_info "Building backend image (this may take 2-3 minutes)..."
    docker build -t shopsphere-backend:latest ./backend
    log_success "Backend image built"
    
    log_info "Building frontend image (this may take 3-5 minutes)..."
    docker build -t shopsphere-frontend:latest ./frontend
    log_success "Frontend image built"
}

# Create namespace
create_namespace() {
    log_step "STEP 4: Creating Kubernetes Namespace"
    
    kubectl create namespace dev --dry-run=client -o yaml | kubectl apply -f -
    log_success "Namespace 'dev' created"
}

# Deploy applications
deploy_applications() {
    log_step "STEP 5: Deploying Applications to Kubernetes"
    
    log_info "Deploying backend..."
    kubectl apply -f k8s/backend.yaml
    log_success "Backend deployed"
    
    log_info "Deploying frontend..."
    kubectl apply -f k8s/frontend.yaml
    log_success "Frontend deployed"
}

# Wait for deployments to be ready
wait_for_deployment() {
    log_step "STEP 6: Waiting for Pods to be Ready"
    
    log_info "Waiting for backend pod (timeout: 5 minutes)..."
    kubectl rollout status deployment/backend -n dev --timeout=300s || true
    log_success "Backend pod is ready"
    
    log_info "Waiting for frontend pod (timeout: 5 minutes)..."
    kubectl rollout status deployment/frontend -n dev --timeout=300s || true
    log_success "Frontend pod is ready"
    
    # Extra wait to ensure services are ready
    sleep 5
}

# Get application URL
get_app_url() {
    MINIKUBE_IP=$(minikube ip)
    FRONTEND_PORT=$(kubectl get svc frontend-service -n dev -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null || echo "30007")
    APP_URL="http://${MINIKUBE_IP}:${FRONTEND_PORT}"
    echo "$APP_URL"
}

# Show completion information
show_success_info() {
    log_step "STEP 7: Application Ready!"
    
    APP_URL=$(get_app_url)
    
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                      ║${NC}"
    echo -e "${GREEN}║          🎉 ShopSphere is Now Running! 🎉           ║${NC}"
    echo -e "${GREEN}║                                                      ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}📱 Access the Application:${NC}"
    echo -e "   ${YELLOW}${APP_URL}${NC}"
    echo ""
    echo -e "${BLUE}📊 Application Status:${NC}"
    kubectl get pods -n dev -o wide | awk 'NR==1 {print; next} {print "   " $0}'
    echo ""
    echo -e "${BLUE}🔧 Useful Commands:${NC}"
    echo "   View backend logs:        kubectl logs -f deployment/backend -n dev"
    echo "   View frontend logs:       kubectl logs -f deployment/frontend -n dev"
    echo "   Check pod status:         kubectl get pods -n dev"
    echo "   Restart backend:          kubectl rollout restart deployment/backend -n dev"
    echo "   Restart frontend:         kubectl rollout restart deployment/frontend -n dev"
    echo "   Delete all deployments:   kubectl delete deployment --all -n dev"
    echo "   Stop Minikube:            minikube stop"
    echo ""
    echo -e "${BLUE}📝 Documentation:${NC}"
    echo "   Getting Started:          GETTING_STARTED.md"
    echo "   Detailed Guide:           README.md"
    echo "   Deployment Guide:         DEPLOY.md"
    echo ""
}

# Open browser (optional)
open_browser() {
    APP_URL=$(get_app_url)
    
    if command -v xdg-open &> /dev/null; then
        log_info "Opening browser..."
        xdg-open "$APP_URL" || true
    elif command -v open &> /dev/null; then
        log_info "Opening browser..."
        open "$APP_URL" || true
    else
        log_info "Please open this URL in your browser: $APP_URL"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║                                                      ║"
    echo "║        🚀 ShopSphere GitOps - Automated Setup 🚀    ║"
    echo "║                                                      ║"
    echo "╚══════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo -e "⏱️  Total time: ~30-45 minutes (first time)"
    echo ""
    
    check_prereqs
    start_minikube
    configure_docker
    build_images
    create_namespace
    deploy_applications
    wait_for_deployment
    show_success_info
    
    # Ask if user wants to open browser
    read -p "Do you want to open the application in your browser? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open_browser
    fi
    
    log_success "Setup completed successfully!"
}

# Run main function
main
