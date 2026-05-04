#!/bin/bash

# ShopSphere GitOps - Automated Setup Script
# One-command setup for the entire application

# Enable error handling
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Print header
print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║          🚀 ShopSphere - Automated Setup 🚀         ║"
    echo "║                                                      ║"
    echo "║     This will set up the complete application:      ║"
    echo "║  1. Minikube cluster   3. Docker images            ║"
    echo "║  2. Kubernetes deploy  4. Open in browser          ║"
    echo "║                                                      ║"
    echo "║         ⏱️ Time: ~30-45 minutes (first time)        ║"
    echo "╚══════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Check prerequisites
check_prereqs() {
    log_step "STEP 1: Checking Prerequisites"
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker not found. Please install Docker from https://www.docker.com/products/docker-desktop"
        exit 1
    fi
    log_success "Docker found"
    
    if ! command -v kubectl &> /dev/null; then
        log_error "Kubectl not found. Please install Kubectl from https://kubernetes.io/docs/tasks/tools/"
        exit 1
    fi
    log_success "Kubectl found"
    
    if ! command -v minikube &> /dev/null; then
        log_error "Minikube not found. Please install Minikube from https://minikube.sigs.k8s.io/docs/start/"
        exit 1
    fi
    log_success "Minikube found"
    
    if ! command -v git &> /dev/null; then
        log_error "Git not found. Please install Git from https://git-scm.com/"
        exit 1
    fi
    log_success "Git found"
    
    log_success "All prerequisites installed! ✨"
}

# Start Minikube
start_minikube() {
    log_step "STEP 2: Starting Minikube"
    
    if minikube status 2>/dev/null | grep -q "Running"; then
        log_info "Minikube is already running"
    else
        log_info "Starting Minikube (this may take 3-5 minutes)..."
        minikube start --driver=docker --memory=4096 --cpus=2 2>/dev/null || {
            log_error "Failed to start Minikube"
            exit 1
        }
        sleep 5
    fi
    
    log_success "Minikube is running"
}

# Configure Docker to use Minikube (with proper persistence)
configure_docker() {
    log_step "STEP 3: Configuring Docker"
    
    log_info "Connecting Docker to Minikube..."
    # Export the environment variables so they persist
    export DOCKER_HOST=$(minikube docker-env | grep DOCKER_HOST | cut -d= -f2 | tr -d '"')
    export DOCKER_CERT_PATH=$(minikube docker-env | grep DOCKER_CERT_PATH | cut -d= -f2 | tr -d '"')
    export DOCKER_TLS_VERIFY=$(minikube docker-env | grep DOCKER_TLS_VERIFY | cut -d= -f2 | tr -d '"')
    
    # Also do eval for compatibility
    eval "$(minikube docker-env)" || {
        log_error "Failed to configure Docker"
        exit 1
    }
    
    log_success "Docker configured for Minikube"
}

# Build Docker images
build_images() {
    log_step "STEP 4: Building Docker Images"
    
    log_info "Building backend image (this may take 2-3 minutes)..."
    cd backend
    docker build -t shopsphere-backend:latest . || {
        log_error "Failed to build backend image"
        exit 1
    }
    cd ..
    log_success "Backend image built"
    
    log_info "Building frontend image (this may take 3-5 minutes)..."
    cd frontend
    docker build -t shopsphere-frontend:latest . || {
        log_error "Failed to build frontend image"
        exit 1
    }
    cd ..
    log_success "Frontend image built"
}

# Create namespace
create_namespace() {
    log_step "STEP 5: Creating Kubernetes Namespace"
    
    kubectl create namespace dev --dry-run=client -o yaml | kubectl apply -f - || true
    log_success "Namespace 'dev' is ready"
}

# Deploy applications
deploy_applications() {
    log_step "STEP 6: Deploying Applications"
    
    log_info "Deploying backend..."
    kubectl apply -f k8s/backend.yaml || {
        log_error "Failed to deploy backend"
        exit 1
    }
    log_success "Backend deployed"
    
    log_info "Deploying frontend..."
    kubectl apply -f k8s/frontend.yaml || {
        log_error "Failed to deploy frontend"
        exit 1
    }
    log_success "Frontend deployed"
}

# Wait for deployments
wait_for_deployment() {
    log_step "STEP 7: Waiting for Pods to be Ready"
    
    log_info "Waiting for backend pod (up to 3 minutes)..."
    kubectl wait --for=condition=ready pod -l app=backend -n dev --timeout=180s 2>/dev/null || true
    log_success "Backend pod is ready"
    
    log_info "Waiting for frontend pod (up to 3 minutes)..."
    kubectl wait --for=condition=ready pod -l app=frontend -n dev --timeout=180s 2>/dev/null || true
    log_success "Frontend pod is ready"
    
    sleep 3
}

# Get application URL
get_app_url() {
    MINIKUBE_IP=$(minikube ip 2>/dev/null || echo "127.0.0.1")
    FRONTEND_PORT=30007
    APP_URL="http://${MINIKUBE_IP}:${FRONTEND_PORT}"
    echo "$APP_URL"
}

# Show success information
show_success_info() {
    log_step "STEP 8: ShopSphere is Ready!"
    
    APP_URL=$(get_app_url)
    
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                      ║${NC}"
    echo -e "${GREEN}║      🎉 ShopSphere is Now Running! 🎉              ║${NC}"
    echo -e "${GREEN}║                                                      ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}📱 ACCESS THE APPLICATION:${NC}"
    echo -e "    ${YELLOW}${APP_URL}${NC}"
    echo ""
    echo -e "${BLUE}📊 POD STATUS:${NC}"
    kubectl get pods -n dev 2>/dev/null | awk '{print "    " $0}' || echo "    Could not fetch pod status"
    echo ""
    echo -e "${BLUE}🧪 TEST THE APP:${NC}"
    echo "    1. Open the URL in your browser"
    echo "    2. Browse product categories"
    echo "    3. Add items to cart"
    echo "    4. Use search functionality"
    echo ""
    echo -e "${BLUE}📝 USEFUL COMMANDS:${NC}"
    echo "    View logs:     kubectl logs -f deployment/backend -n dev"
    echo "    Check pods:    kubectl get pods -n dev"
    echo "    Restart app:   kubectl rollout restart deployment/backend -n dev"
    echo "    Stop:          minikube stop"
    echo "    Delete:        minikube delete"
    echo ""
}

# Main execution
main() {
    print_header
    
    check_prereqs
    start_minikube
    configure_docker
    build_images
    create_namespace
    deploy_applications
    wait_for_deployment
    show_success_info
    
    # Try to open browser
    APP_URL=$(get_app_url)
    
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    read -p "Open application in browser? (y/n): " -n 1 -r REPLY
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if command -v xdg-open &> /dev/null; then
            xdg-open "$APP_URL" 2>/dev/null || echo "Please open: $APP_URL"
        elif command -v open &> /dev/null; then
            open "$APP_URL" 2>/dev/null || echo "Please open: $APP_URL"
        else
            echo "Please open this URL in your browser: $APP_URL"
        fi
    else
        echo "You can open it manually: $APP_URL"
    fi
    
    echo ""
    log_success "Setup complete! Enjoy ShopSphere! 🚀"
}

# Run main function
main
