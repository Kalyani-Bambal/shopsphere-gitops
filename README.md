# 🛍️ ShopSphere - Complete GitOps E-Commerce Application

A production-ready online shopping application demonstrating the complete DevOps workflow:

**Terraform** → **GitHub Actions** → **Kubernetes** → **ArgoCD**

---

## 🎯 What You'll Learn

This project shows you:
- 🏗️ **Infrastructure as Code** with Terraform
- 🔄 **CI/CD Automation** with GitHub Actions
- ☸️ **Container Orchestration** with Kubernetes
- 🚀 **GitOps** with ArgoCD

---

## 📦 Prerequisites

Install these 5 tools on your computer:

| Tool | Purpose | Download |
|------|---------|----------|
| **Docker** | Container runtime | https://www.docker.com/products/docker-desktop |
| **Minikube** | Local Kubernetes cluster | https://minikube.sigs.k8s.io/docs/start/ |
| **Kubectl** | Kubernetes CLI | https://kubernetes.io/docs/tasks/tools/ |
| **Terraform** | Infrastructure as Code | https://www.terraform.io/downloads |
| **Git** | Version control | https://git-scm.com/ |

### ✅ Verify Installation

```bash
docker --version           # Docker 20.10+
minikube version           # v1.25+
kubectl version --client   # Recent version
terraform version          # v1.5+
git --version              # 2.x+
```

All showing versions? ✅ You're ready!

---

## ⏱️ Estimated Time

- **Stage 1:** 10 minutes
- **Stage 2:** 15 minutes
- **Stage 3:** 10 minutes
- **Stage 4:** 10 minutes
- **Stage 5:** 10 minutes

**Total: ~55 minutes** (first time)

---

## 📍 COMPLETE WORKFLOW

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
kubectl port-forward -n monitoring svc/grafana 3000:80

# Open browser: http://localhost:3000
# Login: admin / admin
```

### Access Prometheus

```bash
# Port-forward to Prometheus
kubectl port-forward -n monitoring svc/prometheus 9090:9090

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
