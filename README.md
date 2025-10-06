# 🚀 Hello K8s Practice App

A simple, bulletproof Node.js application designed for practicing Docker containerization and Kubernetes orchestration. Perfect for learning, testing, and sharing with colleagues!

## ✨ Features

- **🎯 Zero-trouble deployment** - Works immediately without configuration
- **🐳 Multi-container setup** - App + PostgreSQL database  
- **☸️ Kubernetes ready** - Complete manifests included
- **🌐 Beautiful web interface** - Visual dashboard with real-time status
- **🔧 Flexible database** - Works standalone or with database
- **📊 Health checks** - Liveness, readiness, and startup probes
- **🔒 Security best practices** - Non-root containers, RBAC, network policies
- **🎨 Professional UI** - Encourages successful deployments

## 🚀 Quick Start

### Local Development
```bash
npm install
npm start
# Visit http://localhost:3000
```

### Docker (Standalone)
```bash
docker build -t hello-k8s .
docker run -p 3000:3000 hello-k8s
```

### Docker Compose (With Database)
```bash
docker-compose up -d
# Visit http://localhost:3000
```

### Pull from DockerHub
```bash
docker pull temitayocharles/hello-k8s:latest
docker run -p 3000:3000 temitayocharles/hello-k8s:latest
```

## 🎯 What You'll See

When successfully deployed, you'll see a beautiful dashboard with:

- **🎉 Success message** - "Congratulations! You were successful..."
- **📊 Application status** - Health, uptime, environment
- **💾 Database status** - Connection status and health
- **⚙️ System information** - Node.js version, platform, memory
- **🔧 Environment variables** - Configuration display
- **📝 Data management** - Add/view database items
- **🔗 API endpoints** - Interactive testing buttons

## 🏗️ Architecture

### Application Structure
```
├── src/
│   ├── app.js              # Main application
│   └── public/
│       └── index.html      # Web dashboard
├── database/
│   └── init.sql           # Database initialization
├── k8s/                   # Kubernetes manifests
├── docker-compose.yml     # Local development
└── Dockerfile            # Container definition
```

### Container Architecture
- **App Container**: Node.js application (port 3000)
- **Database Container**: PostgreSQL with sample data
- **Security**: Non-root users, minimal privileges
- **Health Checks**: Built-in liveness/readiness probes

## ☸️ Kubernetes Practice

Perfect for practicing these Kubernetes concepts:

### Basic Resources
- **Deployments** - Application scaling and updates
- **Services** - ClusterIP, NodePort, LoadBalancer
- **ConfigMaps** - Environment configuration
- **Secrets** - Database credentials
- **Namespaces** - Resource isolation

### Advanced Resources
- **StatefulSets** - Database with persistent storage
- **PersistentVolumes** - Data persistence
- **Ingress** - External access and routing
- **NetworkPolicies** - Traffic control
- **HPA** - Horizontal Pod Autoscaling
- **RBAC** - Security and permissions

### Use Cases
```bash
# Deploy to Kubernetes
kubectl apply -f k8s/

# Scale the application
kubectl scale deployment k8s-practice-app --replicas=5

# Check pod status
kubectl get pods -n k8s-practice

# Test connectivity
kubectl port-forward svc/k8s-practice-app-service 3000:80 -n k8s-practice
```

## 🛡️ Security Features

- **Non-root containers** - Runs as user 1001
- **Read-only filesystem** - Prevents runtime modifications
- **Security contexts** - Minimal privileges
- **Network policies** - Restricted pod communication
- **Secrets management** - Encrypted credential storage
- **RBAC** - Role-based access control

## 🔧 Configuration

### Environment Variables
```bash
NODE_ENV=development          # development/production
PORT=3000                    # Application port
DB_ENABLED=true              # Enable database connection
DB_HOST=postgres-service     # Database hostname
DB_USER=k8s_user            # Database user
DB_PASSWORD=***             # Database password (use secrets)
```

### Database Configuration
- **Database**: PostgreSQL 15
- **Default User**: k8s_user (non-root)
- **Sample Data**: Pre-loaded items for testing
- **Security**: SCRAM-SHA-256 authentication

## 🎯 Perfect For

- **Learning containerization** - Docker fundamentals
- **Kubernetes practice** - All major concepts covered
- **Demo applications** - Professional appearance
- **Teaching workshops** - Clear, working examples
- **Troubleshooting practice** - Built-in monitoring
- **Architecture testing** - Multi-tier application

## 🤝 Sharing with Colleagues

Your colleagues will see the **"Congratulations!"** message when they successfully deploy, making it perfect for:

- **Onboarding new team members**
- **Kubernetes workshops and training**
- **Proof-of-concept deployments**
- **Architecture demonstrations**
- **Practice environments**

## 📝 API Endpoints

- `GET /` - Web dashboard
- `GET /health` - Health check (K8s liveness)
- `GET /ready` - Readiness check (K8s readiness)
- `GET /live` - Liveness probe
- `GET /api/info` - Application information
- `GET /api/data` - Database items
- `POST /api/data` - Create new item
- `GET /api/env` - Environment variables

## 🚀 Next Steps

1. **Deploy locally** with Docker Compose
2. **Push to your registry** (optional)
3. **Practice with Kubernetes** using provided manifests
4. **Customize for your needs** - it's designed to be modified
5. **Share with your team** - watch them succeed!

---

## 🌟 Happy Practicing!

*Keep experimenting, keep learning, keep building amazing things!* ✨

Built with ❤️ for the Kubernetes community.