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


<img width="1024" height="1536" alt="shopsphere-gitops diagram" src="https://github.com/user-attachments/assets/735fa041-0a34-44d8-a309-dda12d20b504" />




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
