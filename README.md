# Flask App with Jenkins CI/CD Pipeline .

A Flask web application with user authentication that displays personalized motivational phrases. Users can create accounts, log in, and manage their own custom phrases. The app is integrated with Jenkins for automated build, test, and deployment using Docker.

## 🚀 Features

- **User Authentication**: Secure registration and login system
- **Personalized Phrases**: Each user can create and manage their own motivational quotes
- **Random Phrase Generator**: Displays user's custom phrases or default inspirational quotes
- **SQLite Database**: Persistent storage for user accounts and phrases
- **Dockerized Application**: Containerized Flask app with database persistence
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
│   ├── app.py                 # Main Flask application with auth
│   └── templates/
│       ├── index.html         # Home page template
│       ├── login.html         # Login page template
│       ├── signup.html        # Registration page template
│       └── my_phrases.html    # Phrase management page
├── Dockerfile                 # Docker image configuration
├── docker-compose.yml         # Docker Compose for local development
├── requirements.txt           # Python dependencies
├── Jenkinsfile               # Jenkins pipeline configuration
├── script.groovy             # Reusable Jenkins functions
└── README.md                 # This file
```

## 🐳 Local Development

### Option 1: Using Docker Compose (Recommended)

1. **Start the application:**
   ```bash
   docker-compose up --build
   ```

2. **Access the app:**
   Open your browser and go to `http://localhost:5000`

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Option 2: Using Virtual Environment

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

### Option 3: Using Docker

1. **Build the Docker image:**
   ```bash
   docker build -t flask-app .
   ```

2. **Create a volume for database persistence:**
   ```bash
   docker volume create flask_data
   ```

3. **Run the container:**
   ```bash
   docker run -d \
     -p 5000:5000 \
     -v flask_data:/app/data \
     --name flask-app \
     flask-app
   ```

4. **Access the app:**
   Open your browser and go to `http://localhost:5000`

## 👤 User Features

### Authentication System
- **Sign Up**: Create a new account with username, email, and password
- **Login**: Secure authentication with session management
- **Logout**: Clean session termination

### Phrase Management
- **View Phrases**: Display personalized phrases for logged-in users
- **Add Phrases**: Create custom motivational quotes
- **Delete Phrases**: Remove unwanted phrases
- **Default Phrases**: Anonymous users see predefined inspirational quotes

### Navigation
- **Home**: Main page with random phrase display
- **My Phrases**: Personal phrase management dashboard
- **User Menu**: Login/logout and navigation options

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
  - Creates persistent volume for database
  - Deploys new container with latest image
  - Configures environment variables

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
- Creates Docker volume for database persistence
- Deploys new container with restart policy
- Sets environment variables for production

#### `cleanup()`
- Maintains only the latest 5 Docker images
- Prevents disk space issues

## 🚀 Deployment

### Manual Deployment

```bash
# Create volume for database
docker volume create flask_data

# Build and tag image
docker build -t khaledhawil/flask-app:latest .

# Run container with persistence
docker run -d \
  --name flask-app \
  -p 5000:5000 \
  -v flask_data:/app/data \
  -e SECRET_KEY=your-secret-key \
  --restart unless-stopped \
  khaledhawil/flask-app:latest
```

### Jenkins Automated Deployment

1. **Create Jenkins Pipeline Job:**
   - New Item → Pipeline
   - Configure SCM to point to your Git repository
   - Pipeline script from SCM, specify Jenkinsfile

2. **Configure GitHub Webhook (Automatic Builds):**
   - Go to your GitHub repository → Settings → Webhooks
   - Add webhook: `http://your-jenkins-server/github-webhook/`
   - Select "Just the push event"
   - In Jenkins job configuration, check "GitHub hook trigger for GITScm polling"

3. **Trigger Build:**
   - **Automatic**: Pipeline builds automatically when you push commits to GitHub
   - **Manual**: Click "Build Now" in Jenkins dashboard

**Note**: The Jenkins pipeline is configured to build and deploy automatically whenever you push new commits to the GitHub repository. This enables continuous integration and deployment (CI/CD) workflow.

## 🧪 Testing

### Application Features

1. **Anonymous Access:**
   ```
   http://localhost:5000
   ```
   - Should display default motivational phrases
   - Refresh to see different quotes

2. **User Registration:**
   ```
   http://localhost:5000/signup
   ```
   - Create a new account
   - Verify email validation

3. **User Login:**
   ```
   http://localhost:5000/login
   ```
   - Login with created credentials
   - Verify session management

4. **Phrase Management:**
   ```
   http://localhost:5000/my-phrases
   ```
   - Add custom phrases
   - Delete unwanted phrases
   - Verify persistence after container restart

### Health Check Endpoint

```bash
curl -f http://localhost:5000/health
```

## 📊 Monitoring

### Container Status

```bash
# Check running containers
docker ps

# View container logs
docker logs flask-app

# Monitor resource usage
docker stats flask-app

# Check database volume
docker volume inspect flask_data
```

### Database Management

```bash
# Access container shell
docker exec -it flask-app /bin/bash

# Check database file
ls -la /app/data/

# View database tables (if sqlite3 is installed)
sqlite3 /app/data/app.db ".tables"
```

### Jenkins Build Status

- Access Jenkins dashboard for build history
- View console output for detailed logs
- Monitor pipeline success/failure rates

## 🔒 Security

- **Password Hashing**: Secure password storage using Werkzeug
- **Session Management**: Flask session handling
- **Docker Hub Credentials**: Stored securely in Jenkins
- **Database Isolation**: SQLite database in persistent volume
- **Environment Variables**: Secure secret key management
- **Container Security**: Restart policy for availability

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   docker stop flask-app
   docker rm flask-app
   ```

2. **Database issues:**
   ```bash
   # Check database volume
   docker volume inspect flask_data
   
   # Reset database (WARNING: deletes all data)
   docker volume rm flask_data
   docker volume create flask_data
   ```

3. **Build failures:**
   - Check Docker daemon is running
   - Verify Docker Hub credentials
   - Review Jenkins console output

4. **Authentication issues:**
   - Clear browser cookies/session
   - Check container logs for errors
   - Verify database initialization

### Debug Commands

```bash
# Check container logs
docker logs flask-app

# Access container shell
docker exec -it flask-app /bin/bash

# Check database file
docker exec flask-app ls -la /app/data/

# Test database connection
docker exec flask-app python -c "import sqlite3; print('DB OK')"

# Check Jenkins pipeline logs
# Go to Jenkins → Job → Build History → Console Output
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with docker-compose
5. Submit a pull request

## 👨‍💻 Author

**Khaled Hawil** - Cloud and DevOps Engineer

**GitHub Repository**: Automatically triggers Jenkins builds on every commit push

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For issues and questions:
- Check the troubleshooting section
- Review Jenkins console logs
- Create an issue in the repository
- Test with docker-compose for local debugging

---

**Happy Coding! 🎉**