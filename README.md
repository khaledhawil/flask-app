# Islamic Web Application with CI/CD Pipeline

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/khaledhawil/flask-app)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://hub.docker.com/r/khaledhawil/flask-app)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11-blue.svg)](https://python.org)

A comprehensive Islamic web application built with Flask, featuring prayer times, Quran reading, digital tasbeh, hadith collections, and user authentication. The application is fully containerized with Docker and includes a complete Jenkins CI/CD pipeline for automated deployment.

## Key Features

### Islamic Features
- **Quran Reader**: Complete Quran with multiple translations and audio recitation
- **Prayer Times**: Accurate prayer times based on user location with notifications
- **Digital Tasbeh**: Interactive Islamic phrase counter with progress tracking
- **Hadith Collection**: Comprehensive collection of authentic hadiths from major sources
- **Personal Duas**: Custom prayer and dua management system
- **Islamic Calendar**: Hijri calendar integration with Islamic events

### Technical Features
- **User Authentication**: Secure registration, login, and session management
- **Personal Dashboard**: User statistics and spiritual progress tracking
- **Dockerized Application**: Full containerization with volume persistence
- **CI/CD Pipeline**: Automated Jenkins pipeline for build, test, and deployment
- **Responsive Design**: Mobile-first design with progressive web app features
- **Security**: Password hashing, secure sessions, and input validation

## Project Architecture

```
islamic-flask-app/
├── Docker Configuration
│   ├── Dockerfile                 # Multi-stage production build
│   ├── docker-compose.yml         # Local development setup
│   └── .dockerignore              # Optimized build context
│
├── CI/CD Pipeline
│   ├── Jenkinsfile                # Jenkins pipeline definition
│   ├── script.groovy              # Reusable pipeline functions
│   └── tests/                     # Automated testing suite
│
├── Application Source
│   └── src/
│       ├── app.py                 # Main Flask application
│       ├── config/                # Application configuration
│       ├── models/                # Database models
│       │   ├── user.py           # User authentication model
│       │   ├── tasbeh.py         # Tasbeh counter model
│       │   └── database.py       # Database connection manager
│       ├── routes/                # API and route handlers
│       │   ├── __init__.py       # Blueprint registration
│       │   └── islamic_content.py # Quran and Islamic content API
│       ├── services/              # Business logic services
│       │   └── prayer_service.py # Prayer times calculation
│       ├── utils/                 # Utility functions
│       ├── templates/             # Jinja2 HTML templates
│       │   ├── base.html         # Base template with navigation
│       │   ├── index.html        # Homepage with dashboard
│       │   ├── quran.html        # Quran reader interface
│       │   ├── prayer_times.html # Prayer schedule display
│       │   ├── tasbeh.html       # Digital tasbeh counter
│       │   ├── hadith.html       # Hadith browser
│       │   └── auth/             # Authentication templates
│       └── static/               # Static assets
│           ├── css/              # Stylesheets with Islamic themes
│           └── js/               # Interactive JavaScript features
│
└── Documentation
    ├── README.md                  # This comprehensive guide
    └── requirements.txt           # Python dependencies
```

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.11+ (for local development)
- Jenkins (for CI/CD pipeline)
- Git

### Docker Deployment (Recommended)

```bash
# Clone the repository
git clone https://github.com/khaledhawil/flask-app.git
cd flask-app

# Start with Docker Compose
docker-compose up --build -d

# Access the application
open http://localhost:5000
```

### Local Development

```bash
# Create virtual environment
python3 -m venv islamic_app_env
source islamic_app_env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python src/app.py --init-db

# Run development server
export FLASK_ENV=development
python src/app.py
```

## Application Features

### Islamic Features

#### Quran Reader (`/quran`)
- Complete Mushaf with all 114 surahs in Arabic text
- Multiple translations in English, Urdu, and other languages
- High-quality audio recitation with multiple reciters
- Search functionality to find verses by keyword or surah
- Bookmarking system to save favorite verses
- Reading progress tracking

#### Prayer Times (`/prayer-times`)
- Location-based automatic detection or manual entry
- Multiple Islamic calculation methods
- Browser notifications for prayer times
- Qibla direction compass pointing to Mecca
- Monthly prayer schedule calendar
- Prayer consistency tracking

#### Digital Tasbeh (`/tasbeh`)
- Interactive counter with touch/click increment
- Pre-loaded Islamic phrases and dhikr
- Custom phrases for personal duas and adhkar
- Daily, weekly, and monthly progress statistics
- Goal setting and tracking system
- Mobile haptic feedback support

#### Hadith Collection (`/hadith`)
- Authentic sources: Bukhari, Muslim, Abu Dawud, Tirmidhi, Ibn Majah
- Original Arabic text with English translations
- Search and filter by topic or narrator
- Daily hadith feature with new hadith each day
- Favorites system to save important hadiths
- Social media sharing capabilities

### User Features

#### Authentication System
- Secure registration with email validation
- Strong password requirements and hashing
- Persistent login sessions with security
- Password recovery via email
- Profile management and updates

#### Personal Dashboard
- Spiritual statistics including prayer times and tasbeh counts
- Achievement system with badges for spiritual milestones
- Streak tracking for worship consistency
- Daily goals for Islamic practices

## CI/CD Pipeline

### Jenkins Pipeline Stages

```groovy
pipeline {
    agent any
    
    stages {
        stage('Prepare Workspace') {
            // Clean workspace and checkout code
        }
        
        stage('Build & Push Docker Image') {
            // Build Docker image with version tags
            // Push to Docker Hub registry
        }
        
        stage('Deploy Container') {
            // Deploy to production environment
            // Configure persistent volumes
        }
        
        stage('Health Check') {
            // Verify application health
            // Run automated tests
        }
    }
    
    post {
        always {
            // Cleanup old images
            // Send notifications
        }
    }
}
```

### Deployment Features
- Automated builds triggered by Git commits
- Docker Hub integration with automatic image versioning
- Database and user data persistence
- Continuous application health monitoring
- Automatic cleanup of old images
- Build status notifications

## Technology Stack

### Backend
- **Flask 2.2+**: Modern Python web framework
- **SQLite**: Lightweight, file-based database
- **Gunicorn**: WSGI HTTP server for production
- **Werkzeug**: Security utilities for password hashing
- **Requests**: HTTP library for external API integration

### Frontend
- **Jinja2 Templates**: Server-side rendering
- **Responsive CSS**: Mobile-first design
- **JavaScript ES6+**: Interactive features
- **Progressive Web App**: Offline capabilities
- **Islamic Design**: Authentic Islamic UI patterns

### DevOps & Infrastructure
- **Docker**: Containerization platform
- **Jenkins**: CI/CD automation server
- **Docker Hub**: Container registry
- **Docker Compose**: Multi-container orchestration
- **Volume Persistence**: Data backup and recovery

### External APIs
- **Prayer Times API**: Accurate prayer calculations
- **Quran API**: Complete Quran text and translations
- **Hadith API**: Authentic hadith collections
- **Geolocation API**: Location-based services

## Configuration

### Environment Variables

```bash
# Application Configuration
SECRET_KEY=your-super-secure-secret-key
FLASK_ENV=production
DEBUG=false

# Database Configuration
DATABASE_URL=sqlite:///app.db
DB_BACKUP_ENABLED=true

# External API Keys
PRAYER_TIMES_API_KEY=your-api-key
QURAN_API_KEY=your-api-key

# Docker Configuration
DOCKER_REGISTRY=khaledhawil/flask-app
BUILD_NUMBER=${BUILD_NUMBER}
```

## Testing & Quality Assurance

### Test Coverage
```bash
# Run unit tests
python -m pytest tests/ -v

# Run integration tests
python -m pytest tests/integration/ -v

# Generate coverage report
pytest --cov=src tests/
```

### Quality Checks
- **Code Linting**: PEP 8 compliance with flake8
- **Security Scanning**: Dependency vulnerability checks
- **Performance Testing**: Load testing with Apache Bench
- **Accessibility**: WCAG 2.1 compliance testing

##  Monitoring & Analytics

### Health Endpoints
```bash
# Application health
curl http://localhost:5000/health

# Database status
curl http://localhost:5000/health/db

# External API status
curl http://localhost:5000/health/apis
```

### Metrics Dashboard
- **User Engagement**: Active users, session duration
- **Feature Usage**: Prayer times, tasbeh, Quran reading
- **Performance**: Response times, error rates
- **Infrastructure**: Container health, resource usage

##  Security Features

### Application Security
- **Password Hashing**: Werkzeug PBKDF2 with salt
- **CSRF Protection**: Form token validation
- **Session Security**: Secure cookie configuration
- **Input Validation**: XSS and injection prevention
- **Rate Limiting**: API abuse prevention

### Infrastructure Security
- **🐳 Container Security**: Non-root user execution
- **🔑 Secret Management**: Environment variable encryption
- **🌐 HTTPS Ready**: SSL/TLS certificate support
- **🛡️ Network Isolation**: Docker network segmentation

## 🚀 Production Deployment

### Docker Production Setup

```bash
# Create production environment
docker network create islamic-app-network

# Deploy with production configuration
docker run -d \
  --name islamic-flask-app \
  --network islamic-app-network \
  -p 80:5000 \
  -v islamic_data:/app/data \
  -v islamic_logs:/app/logs \
  -e SECRET_KEY=$(openssl rand -base64 32) \
  -e FLASK_ENV=production \
  --restart unless-stopped \
  khaledhawil/flask-app:latest

# Setup reverse proxy (nginx)
docker run -d \
  --name nginx-proxy \
  --network islamic-app-network \
  -p 443:443 \
  -v nginx_certs:/etc/nginx/certs \
  nginx:alpine
```

### Scaling & Load Balancing

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  web:
    image: khaledhawil/flask-app:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
        max_attempts: 3
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - web
```

## 🤝 Contributing

We welcome contributions to improve this Islamic application! Please follow these guidelines:

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/islamic-feature`
3. **Commit** your changes: `git commit -m 'Add new Islamic feature'`
4. **Push** to the branch: `git push origin feature/islamic-feature`
5. **Submit** a pull request

### Contribution Guidelines
- Follow PEP 8 Python style guidelines
- Write unit tests for new features
- Update documentation for API changes
- Ensure Islamic content accuracy and authenticity
- Test with both Docker and local development environments

## 📞 Support & Community

### Getting Help
- **📖 Documentation**: Comprehensive guides and API documentation
- **🐛 Issue Tracking**: GitHub Issues for bug reports
- **💬 Discussions**: GitHub Discussions for questions
- **📧 Contact**: Direct email support for urgent issues

### Community Guidelines
- Respectful and inclusive communication
- Focus on Islamic values and teachings
- Accurate religious content and references
- Constructive feedback and suggestions

## 👨‍💻 Author & Maintainer

**Khaled Hawil** - Cloud & DevOps Engineer
- 🌐 **GitHub**: [@khaledhawil](https://github.com/khaledhawil)
- 📧 **Email**: Khaledhawil91@gmail.com
- 🔗 **LinkedIn**: [khaledhawil](https://www.linkedin.com/in/khaledhawil/)
- 🐳 **Docker Hub**: [khaledhawil/flask-app](https://hub.docker.com/r/khaledhawil/flask-app)


### Open Source Commitment
- Free to use for personal and educational purposes
- Contributions welcome from the global Muslim community
- Commercial use permitted with attribution

## 🙏 Acknowledgments

- **Islamic Sources**: Quran.com, Hadith APIs, and Islamic scholarly resources
- **Open Source Community**: Flask, Docker, and Jenkins contributors
- **Muslim Developers**: Global Islamic tech community
- **Feedback Providers**: Beta testers and early adopters

---

## 📈 Project Status

- ✅ **Core Features**: Complete and stable
- ✅ **CI/CD Pipeline**: Fully automated
- ✅ **Docker Support**: Production-ready
- ✅ **Security**: Enterprise-grade
- 🔄 **Active Development**: Regular updates and improvements
- 📱 **Mobile App**: Coming soon



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


---

**Happy Coding! 🎉**