# 🛍️ ShopSphere - Complete GitOps E-Commerce Application

A production-ready e-commerce application demonstrating the complete **DevOps & GitOps** workflow. This project integrates modern DevOps practices using **Terraform**, **Docker**, **Kubernetes**, **ArgoCD**, **Prometheus**, and **Grafana**.

```
Docker Images → DockerHub → Kubernetes Deployment → ArgoCD Sync → Prometheus/Grafana Monitoring
```

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Building & Pushing Docker Images](#building--pushing-docker-images)
- [Terraform Infrastructure](#terraform-infrastructure)
- [Kubernetes Deployment](#kubernetes-deployment)
- [ArgoCD Setup](#argocd-setup)
- [Monitoring with Prometheus & Grafana](#monitoring-with-prometheus--grafana)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Project Overview

**ShopSphere** is a full-stack e-commerce application that showcases:

✅ **Infrastructure as Code (IaC)** - Terraform for reproducible infrastructure  
✅ **Containerization** - Docker images for backend and frontend  
✅ **Container Registry** - Push images to DockerHub  
✅ **Orchestration** - Kubernetes manifests for deployment  
✅ **GitOps** - ArgoCD for automated synchronization  
✅ **Monitoring** - Prometheus & Grafana for observability  
✅ **Namespace Isolation** - Dev namespace for multi-environment support  

This project helps developers and DevOps engineers learn industry-standard practices.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SHOPSPHERE ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend (React)              Backend (Flask)               │
│  ├─ Product Listing           ├─ REST API                   │
│  ├─ Shopping Cart             ├─ Product Management         │
│  ├─ Checkout                  ├─ Prometheus Metrics         │
│  └─ Search & Filter           └─ Health Check Endpoint      │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ☸️  KUBERNETES (Namespace: dev)                            │
│  ├─ Frontend Deployment (Replicas: 2)                       │
│  ├─ Backend Deployment (Replicas: 2)                        │
│  ├─ Frontend Service (LoadBalancer/NodePort)                │
│  ├─ Backend Service (ClusterIP)                             │
│  └─ ServiceMonitor (for Prometheus scraping)                │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🚀 ARGOCD (GitOps)                                         │
│  └─ Auto-syncs k8s manifests from GitHub repo              │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📊 MONITORING STACK                                        │
│  ├─ Prometheus (Metrics scraping)                           │
│  ├─ Grafana (Visualization & Dashboards)                    │
│  └─ ServiceMonitor (Auto-discovery)                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | Latest |
| **Backend** | Python Flask | 2.3.0+ |
| **Containerization** | Docker | 20.10+ |
| **Container Registry** | Docker Hub | - |
| **Orchestration** | Kubernetes | 1.25+ |
| **Infrastructure** | Terraform | 1.5+ |
| **GitOps** | ArgoCD | Latest |
| **Monitoring** | Prometheus | Latest |
| **Visualization** | Grafana | Latest |
| **Version Control** | Git | 2.x+ |

---

## 📦 Prerequisites

### Required Tools

Install these tools on your system:

| Tool | Purpose | Installation |
|------|---------|--------------|
| **Docker** | Container runtime | https://docs.docker.com/get-docker/ |
| **Minikube** | Local Kubernetes cluster | https://minikube.sigs.k8s.io/docs/start/ |
| **Kubectl** | Kubernetes CLI | https://kubernetes.io/docs/tasks/tools/ |
| **Terraform** | Infrastructure as Code | https://www.terraform.io/downloads.html |
| **Git** | Version control | https://git-scm.com/downloads |
| **Helm** | Kubernetes package manager | https://helm.sh/docs/intro/install/ |

### Verify Installation

```bash
docker --version              # Docker 20.10+
minikube version              # v1.25+
kubectl version --client      # Recent version
terraform version             # v1.5+
git --version                 # 2.x+
helm version                  # 3.x+
```

### Docker Hub Account

- Create a **Docker Hub** account: https://hub.docker.com/
- You'll need credentials to push images: `docker login`

---

## 📂 Project Structure

```
shopsphere-gitops/
├── backend/                      # Flask backend application
│   ├── app.py                   # Main Flask app with REST APIs
│   ├── Dockerfile               # Backend container image
│   └── requirements.txt          # Python dependencies
│
├── frontend/                     # React frontend application
│   ├── Dockerfile               # Frontend container image
│   ├── package.json             # Node dependencies
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Cart.js          # Shopping cart component
│       │   ├── Checkout.js      # Checkout flow
│       │   ├── Navbar.js        # Navigation
│       │   ├── ProductList.js   # Product listing
│       │   └── SearchBar.js     # Search functionality
│       ├── App.js
│       ├── index.js
│       ├── index.css
│       └── setupProxy.js        # API proxy config
│
├── kubernetes/ (k8s/)            # Kubernetes manifests
│   ├── namespace.yaml           # Dev namespace
│   ├── backend.yaml             # Backend deployment & service
│   ├── frontend.yaml            # Frontend deployment & service
│   └── backend-servicemonitor.yaml # Prometheus scrape config
│
├── monitoring/                   # Prometheus & Grafana
│   ├── prometheus.yaml          # Prometheus deployment
│   ├── grafana.yaml             # Grafana deployment
│   └── backend-servicemonitor.yaml # ServiceMonitor for metrics
│
├── argocd/                       # ArgoCD configuration
│   └── application.yaml         # ArgoCD Application resource
│
├── terraform/                    # Infrastructure as Code
│   ├── main.tf                  # Main Terraform config
│   ├── variables.tf             # Variable definitions
│   ├── outputs.tf               # Output values
│   └── terraform.tfstate        # State file (auto-generated)
│
├── html/                         # Static HTML files
│   ├── products.html
│   └── payment.html
│
├── css/
│   └── style.css                # Global styles
│
├── id_rsa_argocd                # SSH key for ArgoCD (git auth)
├── id_rsa_argocd.pub            # Public SSH key
├── setup.sh                     # Automated setup script
├── README.md                    # This file
└── .gitignore

```

---

## 🚀 Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/Kalyani-Bambal/shopsphere-gitops.git
cd shopsphere-gitops
```

### Step 2: Start Minikube

```bash
# Start Minikube cluster
minikube start --cpus=4 --memory=8192 --driver=docker

# Verify cluster is running
kubectl cluster-info
kubectl get nodes
```

### Step 3: Configure Docker for Minikube

```bash
# Point Docker daemon to Minikube
eval $(minikube docker-env)

# Verify
docker ps
```

### Step 4: Create Namespace

```bash
kubectl apply -f k8s/namespace.yaml

# Verify
kubectl get namespaces
```

---

## 🐳 Building & Pushing Docker Images

### Build Backend Image

```bash
cd backend

# Build image
docker build -t <your-dockerhub-username>/shopsphere-backend:latest .

# Example: docker build -t kalyani/shopsphere-backend:latest .
```

### Build Frontend Image

```bash
cd ../frontend

# Build image
docker build -t <your-dockerhub-username>/shopsphere-frontend:latest .

# Example: docker build -t kalyani/shopsphere-frontend:latest .
```

### Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Push backend
docker push <your-dockerhub-username>/shopsphere-backend:latest

# Push frontend
docker push <your-dockerhub-username>/shopsphere-frontend:latest
```

### Update Kubernetes Manifests

After pushing to DockerHub, update the image names in `k8s/backend.yaml` and `k8s/frontend.yaml`:

```yaml
# k8s/backend.yaml
spec:
  containers:
  - name: backend
    image: <your-dockerhub-username>/shopsphere-backend:latest  # Update this
```

```yaml
# k8s/frontend.yaml
spec:
  containers:
  - name: frontend
    image: <your-dockerhub-username>/shopsphere-frontend:latest  # Update this
```

---

## 📝 Terraform Infrastructure

### Initialize Terraform

```bash
cd terraform

# Initialize Terraform
terraform init

# View execution plan
terraform plan

# Apply infrastructure
terraform apply -auto-approve
```

### What Terraform Creates

- **Dev Namespace** - Isolated environment for deployments
- **Kubernetes Resources** - Deployments, Services, ConfigMaps
- **Network Policies** - (Optional) Restrict traffic

### Verify Terraform

```bash
terraform show        # View current state
terraform state list  # List resources
```

### Destroy Infrastructure (When Needed)

```bash
terraform destroy -auto-approve
```

---

## ☸️ Kubernetes Deployment

### Deploy Using kubectl

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy backend
kubectl apply -f k8s/backend.yaml

# Deploy frontend
kubectl apply -f k8s/frontend.yaml

# Verify deployments
kubectl get deployments -n dev
kubectl get pods -n dev
kubectl get services -n dev
```

### Port Forward to Access Application

```bash
# Backend (Flask API)
kubectl port-forward svc/backend-service 5000:5000 -n dev

# Frontend (React)
kubectl port-forward svc/frontend-service 3000:3000 -n dev

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Check Logs

```bash
# Backend logs
kubectl logs -f deployment/backend -n dev

# Frontend logs
kubectl logs -f deployment/frontend -n dev

# View all events
kubectl get events -n dev
```

### Scale Deployments

```bash
# Scale backend to 3 replicas
kubectl scale deployment backend --replicas=3 -n dev

# Scale frontend to 4 replicas
kubectl scale deployment frontend --replicas=4 -n dev
```

---

## 🚀 ArgoCD Setup

### Install ArgoCD

```bash
# Create argocd namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for ArgoCD to be ready
kubectl wait --for=condition=Established crd/applications.argoproj.io --timeout=300s
```

### Access ArgoCD UI

```bash
# Port forward to ArgoCD server
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get initial password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Access UI: https://localhost:8080
# Username: admin
# Password: <output from above>
```

### Deploy Using ArgoCD Application

```bash
# Apply ArgoCD Application resource
kubectl apply -f argocd/application.yaml

# Check ArgoCD application status
kubectl get application -n argocd

# View detailed status
kubectl describe application shopsphere -n argocd
```

### How ArgoCD Works

1. **Git as Source of Truth** - Application manifests in `k8s/` folder
2. **Auto-Sync** - ArgoCD automatically syncs changes from GitHub
3. **Self-Heal** - Automatically corrects manual changes in cluster
4. **Pruning** - Removes resources deleted from Git

### Sync Manually (If Needed)

```bash
# Get ArgoCD password and port-forward as shown above, then:
argocd app sync shopsphere
```

---

## 📊 Monitoring with Prometheus & Grafana

### Install Prometheus Stack

```bash
# Create monitoring namespace
kubectl create namespace monitoring

# Deploy Prometheus
kubectl apply -f monitoring/prometheus.yaml

# Deploy Grafana
kubectl apply -f monitoring/grafana.yaml

# Deploy ServiceMonitor
kubectl apply -f monitoring/backend-servicemonitor.yaml

# Verify deployments
kubectl get pods -n monitoring
```

### Access Prometheus

```bash
# Port forward to Prometheus
kubectl port-forward svc/prometheus -n monitoring 9090:9090

# Access UI: http://localhost:9090
# Query metrics: app_requests_total, etc.
```

### Access Grafana

```bash
# Port forward to Grafana
kubectl port-forward svc/grafana -n monitoring 3000:3000

# Access UI: http://localhost:3000
# Default credentials: admin / admin
```

### Configure Grafana

1. **Add Prometheus Data Source**
   - Settings → Data Sources → Add Prometheus
   - URL: `http://prometheus:9090`
   - Save & Test

2. **Create Dashboard**
   - Create → Dashboard
   - Add Panel → Select metrics from backend (e.g., `app_requests_total`)
   - Visualize metrics

### Available Metrics

The backend exposes Prometheus metrics at `/metrics`:

- `app_requests_total` - Total HTTP requests
- `request_duration_seconds` - Request latency
- Custom business metrics (configurable)

---

## 🔍 Health Checks

### Backend Health Endpoint

```bash
# Check backend health
curl http://localhost:5000/health

# Should return: {"status": "healthy"}
```

### Kubernetes Health Checks

```bash
# Verify pod health
kubectl get pods -n dev -o wide

# Check pod events
kubectl describe pod <pod-name> -n dev

# View readiness probes
kubectl describe deployment backend -n dev
```

---

## ❌ Troubleshooting

### Issue: Minikube Won't Start

```bash
# Solution 1: Increase resources
minikube delete
minikube start --cpus=4 --memory=8192 --driver=docker

# Solution 2: Check Docker daemon
docker ps  # Verify Docker is running

# Solution 3: View Minikube logs
minikube logs
```

### Issue: Pods Stuck in "Pending"

```bash
# Check resource availability
kubectl describe node

# Check pod events
kubectl describe pod <pod-name> -n dev

# Solution: May need more resources
minikube addons list
minikube addons enable metrics-server
```

### Issue: Image Pull Errors

```bash
# Ensure Docker is configured for Minikube
eval $(minikube docker-env)

# Rebuild images
docker build -t shopsphere-backend:latest ./backend
docker build -t shopsphere-frontend:latest ./frontend

# In k8s manifests, use imagePullPolicy: IfNotPresent
```

### Issue: Backend Pod CrashLoopBackOff

```bash
# Check logs
kubectl logs <pod-name> -n dev

# Verify Flask dependencies
kubectl exec -it <pod-name> -n dev -- pip list

# Check environment variables
kubectl exec -it <pod-name> -n dev -- env | grep FLASK
```

### Issue: ArgoCD Application OutOfSync

```bash
# Check what's out of sync
kubectl get application shopsphere -n argocd

# Manual sync
argocd app sync shopsphere

# Hard refresh
kubectl delete pod <argocd-server-pod> -n argocd
```

### Issue: Prometheus Can't Scrape Metrics

```bash
# Verify backend is exposing metrics
curl http://localhost:5000/metrics

# Check ServiceMonitor is created
kubectl get servicemonitor -n dev

# Verify backend service has correct labels
kubectl get service backend-service -n dev -o yaml
```

### Quick Debugging Commands

```bash
# Check all resources in dev namespace
kubectl get all -n dev

# View pod logs (last 50 lines)
kubectl logs --tail=50 -f deployment/backend -n dev

# Execute command in pod
kubectl exec -it <pod-name> -n dev -- /bin/bash

# Get detailed pod info
kubectl describe pod <pod-name> -n dev

# Check node status
kubectl get nodes -o wide
```

---

## 📝 Common Commands Reference

### Docker

```bash
docker build -t name:tag .
docker push name:tag
docker run -p 5000:5000 name:tag
docker ps
docker logs <container-id>
```

### Kubernetes

```bash
kubectl apply -f manifest.yaml
kubectl get pods/services/deployments -n <namespace>
kubectl delete pod <name> -n <namespace>
kubectl port-forward svc/<service> <local-port>:<service-port> -n <namespace>
kubectl logs -f deployment/<name> -n <namespace>
```

### Terraform

```bash
terraform init
terraform plan
terraform apply
terraform destroy
terraform state list
```

### Git

```bash
git clone <repo>
git add .
git commit -m "message"
git push origin main
git pull
```

---

## 💡 Best Practices

✅ **Always use namespace isolation** - Keep dev, staging, prod separate  
✅ **Tag images properly** - Use version tags (v1.0, latest)  
✅ **Monitor continuously** - Set up Grafana dashboards  
✅ **Use ArgoCD** - Let GitOps manage deployments  
✅ **Document changes** - Update README with new workflows  
✅ **Back up state** - Keep `terraform.tfstate` safe  
✅ **Review logs** - Regularly check pod and service logs  
✅ **Set resource limits** - Define CPU/memory requests and limits  

---

## 📖 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Terraform Documentation](https://www.terraform.io/docs/)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Docker Documentation](https://docs.docker.com/)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork the repository**
   ```bash
   git clone https://github.com/<your-username>/shopsphere-gitops.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Update code or documentation
   - Test your changes

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Describe your changes
   - Link any related issues
   - Wait for review

---

## 📄 License

This project is open source and available under the **MIT License**.

---

## 🆘 Support & Questions

If you encounter issues or have questions:

1. **Check Troubleshooting Section** - Most common issues are covered
2. **Review Logs** - Check pod and service logs for errors
3. **Create an Issue** - Open a GitHub issue with detailed description
4. **Documentation** - Refer to official tool documentation links

---

**Last Updated:** May 2026  
**Version:** 1.0.0
- **Stage 5:** 10 minutes

**Total: ~55 minutes** (first time)

---
```
┌─────────────────────────────────────────────────────────┐
│ STAGE 1: Setup                                          │
│ Clone repo, start Minikube, configure Docker            │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ STAGE 2: Infrastructure (Terraform)                     │
│ Create namespaces, storage, install ArgoCD & monitoring │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ STAGE 3: CI/CD Pipeline (GitHub Actions)                │
│ Push to GitHub, configure secrets, test pipeline        │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ STAGE 4: Deploy on Kubernetes                           │
│ Build images, deploy backend & frontend, test app       │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ STAGE 5: GitOps (ArgoCD)                                │
│ Set up ArgoCD, enable auto-sync, verify continuous      │
│ deployment from Git                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 START HERE - Stage 1: Setup (10 minutes)

### 1.1: Clone the Repository

```bash
git clone https://github.com/Kalyani-Bambal/shopsphere-gitops.git
cd shopsphere-gitops
ls -la
```

You should see: `terraform/`, `backend/`, `frontend/`, `k8s/`, `argocd/`, etc.

### 1.2: Configure Git

```bash
git config user.name "Your Name"
git config user.email "your@email.com"
```

### 1.3: Start Minikube

```bash
minikube start --driver=docker --memory=8192 --cpus=4 --disk-size=50g
```

Wait for ✅ message.

### 1.4: Connect Docker to Minikube

```bash
eval "$(minikube docker-env)"
```

⚠️ **Important:** Run this **in every new terminal**.

✅ **Stage 1 Complete!**

---

## 🏗️ STAGE 2: Infrastructure with Terraform (15 minutes)

Terraform will create the Kubernetes infrastructure automatically.

### 2.1: Review Terraform Configuration

```bash
# Navigate to terraform directory
cd terraform

# View what will be created
cat main.tf

# View configuration variables
cat variables.tf
```

### 2.2: Initialize Terraform

```bash
terraform init
```

This downloads Terraform providers.

### 2.3: Review the Execution Plan

```bash
terraform plan
```

Review what will be created.

### 2.4: Apply Terraform Configuration

```bash
terraform apply -auto-approve
```

⏳ **Wait 3-5 minutes** for resources to be created.

### 2.5: Verify Resources Created

```bash
# Check namespaces
kubectl get namespaces

# Should show: dev, argocd, monitoring, kube-system, default

# Check ArgoCD pods
kubectl get pods -n argocd

# Check services
kubectl get svc -n argocd
```

✅ **Stage 2 Complete!** Infrastructure is ready.

---

## 🔄 STAGE 3: CI/CD Pipeline with GitHub Actions (10 minutes)

### 3.1: Create GitHub Repository

1. Go to https://github.com/new
2. Create new repository: `shopsphere-gitops`
3. **DO NOT** initialize with README (we have one)
4. Copy the repository URL

### 3.2: Push Code to GitHub

```bash
# From shopsphere-gitops directory
git remote add origin https://github.com/YOUR_USERNAME/shopsphere-gitops.git
git branch -M main
git add .
git commit -m "Initial commit: ShopSphere with GitOps"
git push -u origin main
```

### 3.3: Configure Docker Registry Secrets

GitHub Actions needs to push Docker images.

Go to GitHub → Settings → Secrets and variables → Actions

Add these secrets:
- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Your Docker Hub password (or token)

Or if using GitHub Container Registry (GHCR):
- `REGISTRY_URL` - ghcr.io
- `REGISTRY_USERNAME` - Your GitHub username
- `REGISTRY_PASSWORD` - Your GitHub PAT (Personal Access Token)

### 3.4: Review GitHub Actions Workflow

```bash
# View the CI/CD workflow
cat .github/workflows/ci-cd.yml
```

This workflow:
- ✅ Runs on every push to main
- ✅ Builds Docker images
- ✅ Pushes images to registry
- ✅ Optionally deploys to Kubernetes

### 3.5: Test the Pipeline

Make a commit to trigger the pipeline:

```bash
echo "# Pipeline test" >> TESTING.md
git add TESTING.md
git commit -m "Test CI/CD pipeline"
git push origin main
```

Watch the pipeline:
- Go to GitHub → Actions tab
- You should see the workflow running
- It should build and push images successfully

✅ **Stage 3 Complete!** CI/CD pipeline is working.

---

## ☸️ STAGE 4: Deploy on Kubernetes (10 minutes)

### 4.1: Build Docker Images

```bash
# Ensure Docker is connected to Minikube
eval "$(minikube docker-env)"

# Build backend
cd backend
docker build -t shopsphere-backend:latest .
cd ..

# Build frontend
cd frontend
docker build -t shopsphere-frontend:latest .
cd ..

# Verify images built
docker images | grep shopsphere
```

### 4.2: Deploy Backend Service

```bash
# Apply backend Kubernetes manifest
kubectl apply -f k8s/backend.yaml

# Check backend pod status
kubectl get pods -n dev
```

Wait for `backend-*` pod to show `Running`.

### 4.3: Deploy Frontend Service

```bash
# Apply frontend Kubernetes manifest
kubectl apply -f k8s/frontend.yaml

# Check all pods
kubectl get pods -n dev
```

You should see both `backend-*` and `frontend-*` running.

### 4.4: Verify Everything

```bash
# View all resources in dev namespace
kubectl get all -n dev
```

Should show:
- 2 running pods (backend, frontend)
- 2 services (backend-service, frontend-service)
- 2 deployments

### 4.5: Open the Application

```bash
# Get the frontend URL
minikube service frontend-service -n dev --url

# Copy the URL and open in browser
```

### 4.6: Test the Application

✅ Browse products by clicking categories  
✅ Search for products using search bar  
✅ Add items to shopping cart  
✅ View cart and see items  

✅ **Stage 4 Complete!** Application is deployed and working!

---

## 🚀 STAGE 5: GitOps with ArgoCD (10 minutes)

ArgoCD continuously syncs your Git repository with Kubernetes.

### 5.1: Access ArgoCD UI

```bash
# Create port-forward to ArgoCD server
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Open browser: **https://localhost:8080**

You may see SSL warning - that's okay for local development. Accept and continue.

### 5.2: Get ArgoCD Login Credentials

In **another terminal**:

```bash
# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
echo ""
```

Login to ArgoCD UI:
- **Username:** `admin`
- **Password:** (from command above)

### 5.3: Create ArgoCD Application via UI

1. Click "Create Application"
2. Fill in these details:
   - **Application Name:** `shopsphere`
   - **Project:** `default`
   - **Sync Policy:** `Automatic`
   - **Repository URL:** `https://github.com/YOUR_USERNAME/shopsphere-gitops`
   - **Path:** `k8s`
   - **Destination Cluster:** `https://kubernetes.default.svc` (in-cluster)
   - **Destination Namespace:** `dev`
3. Click "Create"

### 5.4: Verify ArgoCD Sync

```bash
# Check application status
kubectl get applications -n argocd

# View detailed status
kubectl describe application shopsphere -n argocd

# Check if app is synced
argocd app info shopsphere
```

### 5.5: Test GitOps

Make a change and push to Git:

```bash
# Make a change
echo "# GitOps Test $(date)" >> CHANGES.md

# Push to GitHub
git add CHANGES.md
git commit -m "Test GitOps auto-sync"
git push origin main
```

**Watch ArgoCD UI** - it will automatically detect the change and sync!

### 5.6: Configure Auto-Sync (if not already done)

In ArgoCD UI:
1. Click on `shopsphere` application
2. Click "App Details"
3. Enable "Auto Sync"

Now every Git push triggers automatic deployment! 🎉

✅ **Stage 5 Complete!** Full GitOps workflow is operational!

---

## 🎉 YOU DID IT!

You now have a complete production-ready infrastructure:

✅ **Terraform** - Infrastructure as Code  
✅ **GitHub Actions** - Automated CI/CD pipeline  
✅ **Kubernetes** - Application deployment  
✅ **ArgoCD** - GitOps continuous deployment  

---

## 📊 Optional: View Monitoring

Terraform also installed Prometheus and Grafana for monitoring.

### Access Grafana

```bash
# Port-forward to Grafana
kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80

# Open browser: http://localhost:3000
# Login: admin / admin
```

### Access Prometheus

```bash
# Port-forward to Prometheus
kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-prometheus 9090:9090

# Open browser: http://localhost:9090
```

---

## 📚 Useful Commands

```bash
# Check pod status
kubectl get pods -n dev

# View pod logs
kubectl logs -f -n dev deployment/backend
kubectl logs -f -n dev deployment/frontend

# Restart deployment
kubectl rollout restart deployment/backend -n dev
kubectl rollout restart deployment/frontend -n dev

# Check all resources
kubectl get all -n dev

# View ArgoCD status
kubectl get applications -n argocd
argocd app info shopsphere

# Delete all deployments
kubectl delete deployment --all -n dev

# Stop Minikube
minikube stop

# Delete everything
minikube delete
```

---

## 🐛 Common Issues & Fixes

### **Docker daemon not found**
```bash
# Reconnect to Minikube
eval "$(minikube docker-env)"
```

### **ArgoCD login fails**
```bash
# Reset ArgoCD password
kubectl -n argocd patch secret argocd-secret -p '{"data":{"admin.password":"$2a$10$..."}}
```

### **Pods won't start**
```bash
# Check pod events
kubectl describe pod <pod-name> -n dev

# Check logs
kubectl logs <pod-name> -n dev
```

### **GitHub Actions failing**
- Check GitHub → Actions tab for error details
- Verify Docker secrets are configured correctly
- Check `.github/workflows/ci-cd.yml` file

### **ArgoCD not syncing**
```bash
# Manual sync
argocd app sync shopsphere

# Check sync status
kubectl get applications -n argocd
```

---

## ✅ Final Verification Checklist

- ✅ Terraform created all resources
- ✅ GitHub repository contains all code
- ✅ GitHub Actions pipeline runs on push
- ✅ Backend pod is running (kubectl get pods -n dev)
- ✅ Frontend pod is running
- ✅ Application opens in browser
- ✅ ArgoCD is running (kubectl get pods -n argocd)
- ✅ Application syncs from Git via ArgoCD

---

## 📁 Project Structure

```
shopsphere-gitops/
├── README.md                           # This file
├── STARTUP.md                          # Alternative guide
│
├── terraform/                          # Infrastructure as Code
│   ├── main.tf                         # Resource definitions
│   ├── variables.tf                    # Variables
│   ├── outputs.tf                      # Outputs
│   └── terraform.tfstate               # State file
│
├── .github/workflows/                  # CI/CD Pipeline
│   └── ci-cd.yml                       # GitHub Actions workflow
│
├── backend/                            # Backend API
│   ├── app.py                          # Flask application
│   ├── Dockerfile                      # Docker image
│   └── requirements.txt                # Python dependencies
│
├── frontend/                           # Frontend UI
│   ├── package.json                    # Node dependencies
│   ├── Dockerfile                      # Docker image
│   └── src/                            # React source code
│       ├── App.js
│       ├── index.js
│       └── components/
│
├── k8s/                                # Kubernetes Manifests
│   ├── backend.yaml                    # Backend deployment
│   └── frontend.yaml                   # Frontend deployment
│
└── argocd/                             # ArgoCD Configuration
    └── application.yaml                # ArgoCD application
```

---

## 🔄 Workflow Summary

### How changes flow through the system:

1. **You make code changes** → `git commit && git push`
2. **GitHub Actions runs** → Builds Docker images, pushes to registry
3. **Update k8s manifests** with new image tags
4. **Git push** triggers the pipeline again
5. **ArgoCD detects Git changes** → Automatically syncs to Kubernetes
6. **Kubernetes deploys new images** → Application updates automatically

This is **true GitOps** - Git is the single source of truth!

---

## 🎓 Learning Outcomes

After completing this project, you'll understand:

✅ Terraform for Infrastructure as Code  
✅ GitHub Actions for CI/CD automation  
✅ Kubernetes deployment and services  
✅ Docker containerization  
✅ ArgoCD for GitOps  
✅ Complete DevOps workflow  

---

## 📞 Need Help?

1. **Check logs:** `kubectl logs -f -n dev deployment/<service>`
2. **Verify pods:** `kubectl get pods -n dev`
3. **Review workflow:** `.github/workflows/ci-cd.yml`
4. **Check ArgoCD:** Go to https://localhost:8080
5. **Read STARTUP.md:** Detailed step-by-step guide

---

## 🚀 Next Steps

1. **Customize the application:**
   - Edit `backend/app.py` for API changes
   - Edit `frontend/src/` for UI changes
   - Commit and push to trigger CI/CD

2. **Scale to production:**
   - Deploy to AWS EKS, Google GKE, or Azure AKS
   - Use Terraform to manage cloud infrastructure
   - Configure proper image registry (ECR, GCR, ACR)

3. **Add advanced features:**
   - User authentication
   - Database (PostgreSQL/MongoDB)
   - Message queues (RabbitMQ/Kafka)
   - Service mesh (Istio)

---

## 📖 External Resources

- [Terraform Documentation](https://www.terraform.io/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [Docker Documentation](https://docs.docker.com/)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and test locally
4. Commit: `git commit -m "feat: add your feature"`
5. Push: `git push origin feature/your-feature`
6. Open Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

**Happy deploying! 🚀 You've mastered the complete GitOps workflow!**
