# Kubernetes manifests for Islamic Flask App deployment

This directory contains the Kubernetes manifests needed to deploy the Islamic Flask application on a Kubernetes cluster.

## Files included:

- `namespace.yaml` - Creates a dedicated namespace for the application
- `configmap.yaml` - Contains application configuration
- `persistent-volume.yaml` - Defines storage for the SQLite database
- `persistent-volume-claim.yaml` - Claims storage for the application
- `deployment.yaml` - Main application deployment
- `service.yaml` - Service to expose the application within the cluster
- `ingress.yaml` - Ingress for external access (optional)
- `hpa.yaml` - Horizontal Pod Autoscaler for scaling (optional)

## Deployment Instructions:

1. **Apply the manifests in order:**
   ```bash
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/configmap.yaml
   kubectl apply -f k8s/persistent-volume.yaml
   kubectl apply -f k8s/persistent-volume-claim.yaml
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```

2. **Optional: Apply ingress if you want external access:**
   ```bash
   kubectl apply -f k8s/ingress.yaml
   ```

3. **Optional: Apply HPA for auto-scaling:**
   ```bash
   kubectl apply -f k8s/hpa.yaml
   ```

4. **Or apply all at once:**
   ```bash
   kubectl apply -f k8s/
   ```

## Accessing the Application:

- **Internal access:** `http://islamic-app-service.islamic-app:5000`
- **External access (NodePort):** `http://<node-ip>:30000` - Service is exposed as NodePort on port 30000
- **External access (with ingress):** Configure your ingress controller and access via the configured domain
- **Port forwarding for testing:** `kubectl port-forward -n islamic-app service/islamic-app-service 5000:5000`

## Configuration:

- The application uses SQLite database stored on persistent volume
- Default resource limits are set for 500m CPU and 512Mi memory
- HPA scales between 2-10 replicas based on CPU usage
- Update the configmap to modify application settings

## Security Notes:

- Change the SECRET_KEY in the configmap for production
- Consider using Kubernetes secrets for sensitive data
- Configure proper RBAC if needed
- Set up network policies for additional security
