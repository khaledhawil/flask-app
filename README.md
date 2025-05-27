# Flask App with Jenkins CI/CD Pipeline

A simple Flask web application that displays random motivational phrases on each page reload, integrated with Jenkins for automated build, test, and deployment using Docker.

## 🚀 Features

- **Random Phrase Generator**: Displays inspirational quotes on each page refresh
- **Dockerized Application**: Containerized Flask app for consistent deployments
- **Jenkins CI/CD Pipeline**: Automated build, test, and deployment pipeline
- **Docker Hub Integration**: Automatic image push to Docker registry
- **Health Checks**: Automated health monitoring after deployment
- **Auto-cleanup**: Maintains only the latest Docker images

## 📋 Prerequisites

- Docker installed on your system
- Jenkins server with Docker plugin
- Docker Hub account (for image registry)
- Git repository access

## 🏗️ Project Structure

```
flask-app/
├── src/
│   ├── app.py                 # Main Flask application
│   └── templates/
│       └── index.html         # HTML template
├── Dockerfile                 # Docker image configuration
├── requirements.txt           # Python dependencies
├── Jenkinsfile               # Jenkins pipeline configuration
├── script.groovy             # Reusable Jenkins functions
└── README.md                 # This file
```

## 🐳 Local Development

### Option 1: Using Virtual Environment

1. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application:**
   ```bash
   python src/app.py
   ```

4. **Access the app:**
   Open your browser and go to `http://localhost:5000`

### Option 2: Using Docker

1. **Build the Docker image:**
   ```bash
   docker build -t flask-app .
   ```

2. **Run the container:**
   ```bash
   docker run -p 5000:5000 flask-app
   ```

3. **Access the app:**
   Open your browser and go to `http://localhost:5000`

## 🔧 Jenkins Pipeline Setup

### 1. Jenkins Configuration

1. **Install required plugins:**
   - Docker Plugin
   - Pipeline Plugin
   - Git Plugin

2. **Configure Docker Hub credentials:**
   - Go to Jenkins → Manage Jenkins → Manage Credentials
   - Add Username/Password credential with ID: `dockerhub`

### 2. Pipeline Stages

The Jenkins pipeline includes the following stages:

- **Build**: 
  - Builds Docker image with build number tag
  - Pushes image to Docker Hub registry

- **Deploy**: 
  - Stops existing container
  - Deploys new container with latest image
  - Performs health check

- **Cleanup**: 
  - Removes old Docker images (keeps last 5)
  - Cleans up Docker system

### 3. Pipeline Functions (script.groovy)

#### `buildImage()`
- Builds Docker image with build number tag
- Logs into Docker Hub using Jenkins credentials
- Pushes image to registry
- Handles authentication cleanup

#### `deployApp()`
- Stops and removes existing container
- Deploys new container with restart policy
- Performs health check via curl

#### `cleanup()`
- Maintains only the latest 5 Docker images
- Prevents disk space issues

## 🚀 Deployment

### Manual Deployment

```bash
# Build and tag image
docker build -t khaledhawil/flask-app:latest .

# Run container
docker run -d \
  --name flask-app \
  -p 5000:5000 \
  --restart unless-stopped \
  khaledhawil/flask-app:latest
```

### Jenkins Automated Deployment

1. **Create Jenkins Pipeline Job:**
   - New Item → Pipeline
   - Configure SCM to point to your Git repository
   - Pipeline script from SCM, specify Jenkinsfile

2. **Trigger Build:**
   - Manual: Click "Build Now"
   - Automatic: Configure webhooks for Git push events

## 🧪 Testing

### Health Check Endpoint

The application automatically performs health checks on deployment:

```bash
curl -f http://localhost:5000
```

### Manual Testing

1. **Access the application:**
   ```
   http://localhost:5000
   ```

2. **Verify random phrases:**
   - Refresh the page multiple times
   - Each reload should display a different motivational quote

## 📊 Monitoring

### Container Status

```bash
# Check running containers
docker ps

# View container logs
docker logs flask-app

# Monitor resource usage
docker stats flask-app
```

### Jenkins Build Status

- Access Jenkins dashboard for build history
- View console output for detailed logs
- Monitor pipeline success/failure rates

## 🔒 Security

- Docker Hub credentials stored securely in Jenkins
- Container runs with restart policy for availability
- Regular cleanup prevents resource exhaustion
- Health checks ensure service reliability

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   docker stop flask-app
   docker rm flask-app
   ```

2. **Build failures:**
   - Check Docker daemon is running
   - Verify Docker Hub credentials
   - Review Jenkins console output

3. **Health check failures:**
   - Ensure Flask app binds to 0.0.0.0:5000
   - Check container networking
   - Verify port mappings

### Debug Commands

```bash
# Check container logs
docker logs flask-app

# Access container shell
docker exec -it flask-app /bin/bash

# Check Jenkins pipeline logs
# Go to Jenkins → Job → Build History → Console Output
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 👨‍💻 Author

**Khaled Hawil** - DevOps Engineer

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For issues and questions:
- Check the troubleshooting section
- Review Jenkins console logs
- Create an issue in the repository

---

**Happy Coding! 🎉**