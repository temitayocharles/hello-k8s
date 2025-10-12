# 🚀 Kubernetes Hello World

> Simple containerized application demonstrating Kubernetes fundamentals with deployment, service, and ingress patterns

## 🎯 Overview

This repository contains a minimal Kubernetes application designed to demonstrate core K8s concepts and best practices. Perfect for learning container orchestration basics and testing cluster functionality.

## 🛠️ Technology Stack

- **Container Runtime:** Docker
- **Orchestration:** Kubernetes
- **Application:** [Framework/Language - update based on actual content]
- **Service Mesh:** [If applicable]

## 🚀 Quick Start

### Prerequisites
- Kubernetes cluster (minikube, kind, or cloud provider)
- kubectl configured
- Docker installed

### Deployment

```bash
# Clone the repository
git clone https://github.com/temitayocharles/hello-k8s.git
cd hello-k8s

# Deploy to Kubernetes
kubectl apply -f k8s/

# Check deployment status
kubectl get pods,services,ingress
```

## 📁 Project Structure

```
hello-k8s/
├── k8s/
│   ├── deployment.yaml      # Application deployment
│   ├── service.yaml         # Service configuration
│   └── ingress.yaml         # Ingress controller
├── src/                     # Application source code
├── Dockerfile              # Container definition
└── README.md
```

## 🎯 Learning Objectives

- ✅ **Pod Creation** - Understanding basic pod lifecycle
- ✅ **Service Discovery** - ClusterIP, NodePort, LoadBalancer
- ✅ **Ingress Configuration** - External traffic routing
- ✅ **Resource Management** - Limits and requests
- ✅ **Health Checks** - Liveness and readiness probes

## 🔧 Configuration

### Environment Variables
```yaml
env:
  - name: APP_PORT
    value: "8080"
  - name: LOG_LEVEL
    value: "info"
```

### Resource Limits
```yaml
resources:
  limits:
    memory: "128Mi"
    cpu: "100m"
  requests:
    memory: "64Mi"
    cpu: "50m"
```

## 🧪 Testing

```bash
# Port forward to test locally
kubectl port-forward service/hello-k8s 8080:80

# Test the application
curl http://localhost:8080

# Check application logs
kubectl logs -l app=hello-k8s
```

## 🛡️ Security Features

- Non-root container execution
- Read-only root filesystem
- Security context configuration
- Network policies (if enabled)

## 📊 Monitoring

- Health check endpoints
- Prometheus metrics (if configured)
- Logging to stdout for centralized collection

## 🚀 Advanced Usage

### Scaling
```bash
kubectl scale deployment hello-k8s --replicas=3
```

### Rolling Updates
```bash
kubectl set image deployment/hello-k8s app=hello-k8s:v2
```

### Rollback
```bash
kubectl rollout undo deployment/hello-k8s
```

## 🛠️ Development

```bash
# Build container image
docker build -t hello-k8s:latest .

# Run locally for testing
docker run -p 8080:8080 hello-k8s:latest
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test in a K8s cluster
5. Submit a pull request

## 📚 Related Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [DevOps Portfolio](https://github.com/temitayocharles/devops-portfolio)
- [Fast Kubernetes](https://github.com/temitayocharles/Fast-Kubernetes)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Connect

- 💼 [LinkedIn](https://linkedin.com/in/temitayocharles)
- 🌐 [Portfolio](https://temitayocharles.github.io)
- 📧 [Email](mailto:temitayocharles@example.com)

---

⭐ **Star this repository if it helped you learn Kubernetes!** ⭐
