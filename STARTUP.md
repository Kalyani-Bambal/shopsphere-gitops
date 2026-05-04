# 🚀 ShopSphere - Quick Start Guide

**For complete beginners: Follow this ONE guide to run the application**

---

## ⚡ **FASTEST WAY - One Command**

Copy and paste this in your terminal:

```bash
git clone https://github.com/Kalyani-Bambal/shopsphere-gitops.git && cd shopsphere-gitops && bash setup.sh
```

**That's it!** The script will do everything automatically (takes 30-45 minutes first time).

---

## 📋 **WHAT THE SCRIPT DOES**

The setup.sh script will automatically:
1. ✅ Check if Docker, Minikube, Kubectl are installed
2. ✅ Start Minikube cluster
3. ✅ Build Docker images (backend & frontend)
4. ✅ Deploy to Kubernetes
5. ✅ Wait for everything to be ready
6. ✅ Show you the application URL
7. ✅ Ask if you want to open it in browser

---

## 🔍 **MANUAL SETUP (If you prefer step-by-step)**

### **Step 1: Check Prerequisites** (2 minutes)

Make sure you have these installed:

```bash
# Check Docker
docker --version

# Check Minikube
minikube version

# Check Kubectl
kubectl version --client

# Check Git
git --version
```

**If any command fails:**
- Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Download [Minikube](https://github.com/kubernetes/minikube/releases)
- Download [Kubectl](https://kubernetes.io/docs/tasks/tools/)

### **Step 2: Clone Repository** (1 minute)

```bash
git clone https://github.com/Kalyani-Bambal/shopsphere-gitops.git
cd shopsphere-gitops
```

### **Step 3: Start Minikube** (5 minutes)

```bash
minikube start --driver=docker --memory=4096 --cpus=2

# Point Docker to Minikube
eval "$(minikube docker-env)"

# Verify it's running
minikube status
```

### **Step 4: Build Docker Images** (8 minutes)

```bash
# Build backend
docker build -t shopsphere-backend:latest ./backend

# Build frontend
docker build -t shopsphere-frontend:latest ./frontend

# Verify images built
docker images | grep shopsphere
```

### **Step 5: Create Namespace** (1 minute)

```bash
kubectl create namespace dev
```

### **Step 6: Deploy Backend** (2 minutes)

```bash
kubectl apply -f k8s/backend.yaml

# Check if running
kubectl get pods -n dev
```

### **Step 7: Deploy Frontend** (2 minutes)

```bash
kubectl apply -f k8s/frontend.yaml

# Check all pods
kubectl get pods -n dev
```

**Expected output:**
```
NAME                       READY   STATUS    RESTARTS   AGE
backend-xxx                1/1     Running   0          2m
frontend-xxx               1/1     Running   0          1m
```

### **Step 8: Open in Browser** (1 minute)

```bash
# Get the application URL
minikube service frontend-service -n dev --url

# You'll see something like: http://192.168.49.2:30007
# Open this URL in your browser
```

---

## ✅ **SUCCESS INDICATORS**

You'll know it's working when:

✅ Browser shows ShopSphere homepage  
✅ Can see product categories  
✅ Can add items to cart  
✅ Cart counter updates  
✅ Search bar works  

---

## 🧪 **TEST THE APPLICATION**

1. **Browse Products** - Click on categories (Clothes, Mobiles, Beauty, etc.)
2. **Add to Cart** - Click "Add to Cart" button, see cart number increase
3. **Search** - Type in search bar to find products
4. **View Cart** - Click cart icon to see selected items

---

## 🐛 **COMMON ISSUES & FIXES**

### **Issue: "Connection refused" when opening URL**

```bash
# Check if pods are ready
kubectl get pods -n dev

# If not running, check logs
kubectl logs -n dev deployment/backend
kubectl logs -n dev deployment/frontend

# Restart pods
kubectl rollout restart deployment/backend -n dev
kubectl rollout restart deployment/frontend -n dev
```

### **Issue: Docker images won't build**

```bash
# Make sure you ran this command
eval "$(minikube docker-env)"

# Then try building again
docker build -t shopsphere-backend:latest ./backend
```

### **Issue: Minikube won't start**

```bash
# Delete old cluster
minikube delete

# Start fresh
minikube start --driver=docker --memory=4096 --cpus=2
```

### **Issue: Pods stuck in "Pending"**

```bash
# Check Minikube status
minikube status

# Increase memory
minikube delete
minikube start --driver=docker --memory=8192 --cpus=4
```

---

## 🎯 **USEFUL COMMANDS**

```bash
# View all pods
kubectl get pods -n dev

# View pod logs
kubectl logs -f -n dev deployment/backend
kubectl logs -f -n dev deployment/frontend

# Restart backend
kubectl rollout restart deployment/backend -n dev

# Restart frontend
kubectl rollout restart deployment/frontend -n dev

# Delete everything
kubectl delete deployment --all -n dev

# Stop Minikube
minikube stop

# Delete Minikube cluster
minikube delete
```

---

## 🔄 **RESTART NEXT TIME**

If you've already set everything up before:

```bash
# Start Minikube
minikube start --driver=docker --memory=4096 --cpus=2

# Point Docker to Minikube
eval "$(minikube docker-env)"

# Redeploy
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml

# Open in browser
minikube service frontend-service -n dev
```

Or just run the one-liner again:

```bash
bash setup.sh
```

---

## 📱 **APPLICATION FEATURES**

✨ **Homepage**
- Browse all products
- Search by name
- Filter by category

🛒 **Shopping Cart**
- Add/remove items
- Update quantities
- View total price

💳 **Checkout**
- Enter shipping details
- Place order

---

## 📁 **PROJECT STRUCTURE**

```
shopsphere-gitops/
├── backend/          → Flask API (Python)
├── frontend/         → React UI (JavaScript)
├── k8s/             → Kubernetes configs
├── setup.sh         → Automated setup
└── README.md        → Full documentation
```

---

## 📚 **MORE HELP**

- **Full Documentation:** See [README.md](README.md)
- **Advanced Setup:** See [README.md](README.md) → Terraform, ArgoCD, Monitoring sections
- **Need step-by-step?** Follow the Manual Setup section above

---

## 🎓 **QUICK RECAP**

| What | Command |
|------|---------|
| **Fastest Setup** | `git clone ... && cd shopsphere-gitops && bash setup.sh` |
| **Manual Setup** | Follow "Manual Setup" section above |
| **Start Next Time** | `minikube start && eval "$(minikube docker-env)" && kubectl apply -f k8s/*.yaml` |
| **Stop** | `minikube stop` |
| **Delete** | `minikube delete` |

---

## 🚀 **READY? RUN THIS NOW:**

```bash
git clone https://github.com/Kalyani-Bambal/shopsphere-gitops.git && cd shopsphere-gitops && bash setup.sh
```

**That's it! Enjoy ShopSphere! 🎉**
