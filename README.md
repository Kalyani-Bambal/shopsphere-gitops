# 🛍️ ShopSphere - Online Shopping Application

A simple online shopping website that runs on your computer using containers and Kubernetes.

**What you can do:**
- 🏪 Browse products by category (Clothes, Mobiles, Beauty, Electronics, etc.)
- 🔍 Search for products
- 🛒 Add items to shopping cart
- 💳 Checkout and place orders
- 📱 Responsive design (works on desktop, tablet, mobile)

---

## 📋 What You Need Before Starting

Make sure you have these 4 things installed on your computer:

1. **Docker** - For running containers
   - Download: https://www.docker.com/products/docker-desktop

2. **Minikube** - For running Kubernetes locally
   - Download: https://minikube.sigs.k8s.io/docs/start/

3. **Kubectl** - For managing Kubernetes
   - Usually comes with Docker Desktop
   - If not found, download: https://kubernetes.io/docs/tasks/tools/

4. **Git** - For cloning the project
   - Download: https://git-scm.com/

---

## ✅ Quick Check - Are You Ready?

Run these commands in your terminal:

```bash
docker --version        # Should show: Docker version 20.10.x or higher
minikube version        # Should show: minikube version v1.25.x or higher
kubectl version --client  # Should show version info
git --version           # Should show: git version 2.x.x
```

If all 4 show version numbers, you're ready! ✅

---

## 🚀 How to Run ShopSphere

### **OPTION 1: The FASTEST Way** (Recommended)

Copy and paste this **ONE command** in your terminal:

```bash
git clone https://github.com/Kalyani-Bambal/shopsphere-gitops.git && cd shopsphere-gitops && bash setup.sh
```

That's it! Everything will be set up automatically. The script will show you the website URL when it's done.

---

### **OPTION 2: Follow These 10 Simple Steps**

#### **Step 1: Clone the Project** (1 minute)

```bash
git clone https://github.com/Kalyani-Bambal/shopsphere-gitops.git
cd shopsphere-gitops
```

You should see folders like `backend/`, `frontend/`, `k8s/`, etc.

---

#### **Step 2: Start Minikube** (5 minutes)

Minikube creates a mini Kubernetes cluster on your computer.

```bash
minikube start --driver=docker --memory=4096 --cpus=2
```

Wait for ✅ when complete.

---

#### **Step 3: Connect Docker to Minikube** (1 minute)

This tells Docker to build images inside Minikube.

```bash
eval "$(minikube docker-env)"
```

⚠️ **Important:** Run this command **in every new terminal** you open during this setup.

---

#### **Step 4: Build Backend Image** (3 minutes)

```bash
docker build -t shopsphere-backend:latest ./backend
```

Wait for "Successfully tagged..." message.

---

#### **Step 5: Build Frontend Image** (5 minutes)

```bash
docker build -t shopsphere-frontend:latest ./frontend
```

Wait for "Successfully tagged..." message.

---

#### **Step 6: Create Namespace** (1 minute)

```bash
kubectl create namespace dev
```

---

#### **Step 7: Deploy Backend** (2 minutes)

```bash
kubectl apply -f k8s/backend.yaml
```

Check status:
```bash
kubectl get pods -n dev
```

Wait until `backend-*` shows `Running`.

---

#### **Step 8: Deploy Frontend** (2 minutes)

```bash
kubectl apply -f k8s/frontend.yaml
```

Check status:
```bash
kubectl get pods -n dev
```

You should see 2 pods: `backend-*` and `frontend-*`. Both should be `Running`.

---

#### **Step 9: Verify Everything** (1 minute)

```bash
kubectl get all -n dev
```

Should show 2 pods and 2 services.

---

#### **Step 10: Open in Browser** (1 minute)

```bash
minikube service frontend-service -n dev
```

This opens your website automatically. If not, you'll see a URL like `http://192.168.49.2:30007`

---

## 🎉 SUCCESS! You're Done!

You should see:
- ✅ ShopSphere header/logo
- ✅ Product categories
- ✅ Search bar
- ✅ Product list with "Add to Cart" buttons

---

## 🧪 Test These Features

1. **Browse Products** - Click on categories like "Clothes", "Mobiles", etc.
2. **Add to Cart** - Click "Add to Cart" button, see cart counter increase
3. **Search** - Type in search box to find products
4. **View Cart** - Click cart icon to see items

---

## 🛑 Stop the Application

### **Option 1: Keep everything, just pause**

```bash
minikube stop
```

Next time: `minikube start --driver=docker --memory=4096 --cpus=2`

### **Option 2: Delete everything**

```bash
minikube delete
```

---

## 🔄 Restart Next Time

If you paused Minikube:

```bash
minikube start --driver=docker --memory=4096 --cpus=2
eval "$(minikube docker-env)"
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
minikube service frontend-service -n dev
```

Or just run: `bash setup.sh`

---

## 🐛 Common Problems & Fixes

### **"Cannot connect to Docker"**
- Make sure Docker Desktop is open
- Run: `docker ps`

### **Website shows error or 404**
- Check pods: `kubectl get pods -n dev`
- Restart: `kubectl rollout restart deployment/backend -n dev`
- Wait 30 seconds, then try browser again

### **"Minikube IP not accessible"**
```bash
minikube stop
minikube start --driver=docker --memory=4096 --cpus=2
eval "$(minikube docker-env)"
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

### **"Docker images won't build"**
- Make sure you ran: `eval "$(minikube docker-env)"`
- Try building again

### **"Pods stuck in Pending"**
```bash
minikube delete
minikube start --driver=docker --memory=8192 --cpus=4
eval "$(minikube docker-env)"
docker build -t shopsphere-backend:latest ./backend
docker build -t shopsphere-frontend:latest ./frontend
kubectl create namespace dev
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

---

## 📚 Useful Commands

```bash
# See what's running
kubectl get pods -n dev

# See detailed pod info
kubectl describe pod <pod-name> -n dev

# See pod logs (helpful for debugging)
kubectl logs -f -n dev deployment/backend
kubectl logs -f -n dev deployment/frontend

# Restart backend
kubectl rollout restart deployment/backend -n dev

# Restart frontend
kubectl rollout restart deployment/frontend -n dev

# See all services
kubectl get svc -n dev

# Delete everything
kubectl delete deployment --all -n dev
```

---

## 📁 Project Files

```
shopsphere-gitops/
├── README.md           ← You are here
├── STARTUP.md          ← More detailed guide
├── setup.sh            ← Automated setup script
│
├── backend/            ← Python/Flask API
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/           ← React website
│   ├── package.json
│   ├── Dockerfile
│   └── src/
│
└── k8s/               ← Kubernetes configs
    ├── backend.yaml
    └── frontend.yaml
```

---

## 🎯 Quick Summary

| What | Command |
|------|---------|
| **Fastest Setup** | `git clone ... && cd shopsphere-gitops && bash setup.sh` |
| **Step-by-step** | Follow Steps 1-10 above |
| **Check Status** | `kubectl get pods -n dev` |
| **View Logs** | `kubectl logs -f -n dev deployment/backend` |
| **Open Website** | `minikube service frontend-service -n dev` |
| **Stop** | `minikube stop` |
| **Delete** | `minikube delete` |
| **Restart** | `bash setup.sh` |

---

## ✨ Success Checklist

- ✅ Minikube running
- ✅ 2 Docker images built
- ✅ 2 pods running (check: `kubectl get pods -n dev`)
- ✅ Website opens in browser
- ✅ Can add products to cart
- ✅ Can search products
- ✅ No errors in browser

---

## 🆘 Need More Help?

1. Read detailed guide in [STARTUP.md](STARTUP.md)
2. Check pod logs: `kubectl logs -f -n dev deployment/backend`
3. Restart everything: `bash setup.sh`

---

## 🚀 Ready? Run This Now:

```bash
git clone https://github.com/Kalyani-Bambal/shopsphere-gitops.git && cd shopsphere-gitops && bash setup.sh
```

**Enjoy shopping! 🛍️**
