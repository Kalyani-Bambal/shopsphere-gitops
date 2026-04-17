# ShopSphere GitOps

ShopSphere is a demo online shopping website built for a GitOps-ready Kubernetes deployment on Minikube. It includes:

- Web UI with Home, Menu, Cart, Orders, Payment, and search.
- Product categories for Clothes, Mobiles, Beauty, Home Accessories, Furniture, Electronics, Travel, Gaming Accessories.
- Backend API for products and orders.
- Kubernetes manifests for deployment and NodePort access.
- Terraform bootstrap for ArgoCD, Prometheus, and Grafana.
- GitHub Actions CI/CD workflow scaffold.

## Project structure

- `frontend/` - Static storefront UI and Nginx Docker image.
- `backend/` - Node.js Express API and Docker image.
- `k8s/` - Kubernetes Deployment and Service YAML.
- `argocd/` - ArgoCD Application manifest.
- `terraform/` - Terraform configuration to provision cluster namespaces, ArgoCD, and monitoring.
- `.github/workflows/ci-cd.yml` - GitHub Actions pipeline scaffold.

## Prerequisites

- Docker
- Minikube
- Kubectl
- Terraform 1.5+
- GitHub account for GitHub Actions and optional GHCR image publishing
- Node.js 20 for local backend testing

## Local setup

1. Start Minikube:

```bash
minikube start --driver=docker --memory=4096 --cpus=2
```

2. Use Minikube Docker daemon:

```bash
eval "$(minikube docker-env)"
```

3. Build Docker images locally:

```bash
docker build -t shopsphere-frontend:local ./frontend
docker build -t shopsphere-backend:local ./backend
```

4. Deploy Kubernetes manifests:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

5. Confirm workloads:

```bash
kubectl get pods -n shopsphere
kubectl get svc -n shopsphere
```

6. Open the frontend UI:

```bash
minikube service frontend-service -n shopsphere --url
```

7. Optionally view the backend service:

```bash
minikube service backend-service -n shopsphere --url
```

## ArgoCD setup

1. Initialize Terraform to install ArgoCD and monitoring:

```bash
cd terraform
terraform init
terraform apply -auto-approve
```

2. Expose ArgoCD UI locally:

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

3. Open:

```bash
http://localhost:8080
```

4. Login with default ArgoCD credentials:

- username: `admin`
- password: retrieve with:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode
```

5. Update `argocd/shopsphere-app.yaml` with your GitHub repository URL.

6. Apply the ArgoCD app manifest:

```bash
kubectl apply -f argocd/shopsphere-app.yaml
```

## Monitoring

- Prometheus: NodePort `32090`
- Grafana: NodePort `32091`
- Grafana default admin password: `admin`

## GitHub Actions CI/CD

The workflow in `.github/workflows/ci-cd.yml` runs on `main` pushes. It:

- checks out repository
- installs backend dependencies
- builds frontend and backend Docker images
- supports deployment if `KUBE_CONFIG_DATA` secret is configured

## Notes

- Replace `<YOUR_GITHUB_USERNAME>` in `argocd/shopsphere-app.yaml` with your repository owner.
- If you want ArgoCD to manage the app automatically, push this repo to GitHub and ensure the `repoURL` is accessible.
- Use `kubectl port-forward` or `minikube service` to access the UI, ArgoCD, Prometheus, and Grafana.
