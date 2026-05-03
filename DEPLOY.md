# ShopSphere GitOps - Deployment Guide

## Quick Start with Minikube

### 1. Prerequisites
```bash
# Install required tools
- Docker
- Minikube
- Kubectl
- Node.js 18+ (for local testing)
- Python 3.9+ (for local backend testing)
```

### 2. Start Minikube
```bash
minikube start --driver=docker --memory=4096 --cpus=2
eval "$(minikube docker-env)"
```

### 3. Build Docker Images
```bash
# Build backend image
docker build -t shopsphere-backend:latest ./backend

# Build frontend image
docker build -t shopsphere-frontend:latest ./frontend
```

### 4. Create Namespace
```bash
kubectl create namespace dev
```

### 5. Deploy Applications
```bash
# Deploy backend
kubectl apply -f k8s/backend.yaml

# Deploy frontend
kubectl apply -f k8s/frontend.yaml
```

### 6. Access the Application
```bash
# Get Minikube IP
minikube ip

# Open in browser
# http://<minikube-ip>:30007
```

### 7. View Logs
```bash
# Backend logs
kubectl logs -f deployment/backend -n dev

# Frontend logs
kubectl logs -f deployment/frontend -n dev
```

## Local Development

### Backend (Python Flask)
```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

## Docker Image Registry

For production deployments, update image references in `k8s/backend.yaml` and `k8s/frontend.yaml`:

```yaml
image: your-registry/shopsphere-backend:latest
image: your-registry/shopsphere-frontend:latest
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /products` - Get all products
- `GET /products?category=Clothes` - Get products by category
- `GET /products/<id>` - Get specific product
- `POST /orders` - Create order
- `GET /orders` - Get all orders

## ArgoCD GitOps Deployment

```bash
# Install ArgoCD (requires Helm)
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
helm install argocd argo/argo-cd -n argocd --create-namespace

# Deploy ArgoCD Application
kubectl apply -f argocd/application.yaml

# Access ArgoCD UI
kubectl port-forward -n argocd svc/argocd-server 8080:443
```

## Monitoring (Prometheus & Grafana)

```bash
# Deploy monitoring stack
kubectl apply -f monitoring/namespace.yaml
kubectl apply -f monitoring/prometheus.yaml
kubectl apply -f monitoring/grafana.yaml
```

## Troubleshooting

### Backend not starting
```bash
# Check image exists
docker images | grep shopsphere-backend

# Rebuild if needed
docker build -t shopsphere-backend:latest ./backend
```

### Frontend not connecting to backend
- Verify backend service is running: `kubectl get svc -n dev`
- Check backend URL in frontend environment variable
- Verify CORS is enabled in Flask backend

### Pod not starting
```bash
kubectl describe pod <pod-name> -n dev
kubectl logs <pod-name> -n dev
```

### Port conflicts
Change `nodePort` in frontend.yaml to an available port (30000-32767)
