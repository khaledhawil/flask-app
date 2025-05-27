# Flask Application

This is a simple Flask application that serves as a template for building web applications using Flask. 

## Project Structure

```
flask-app
├── src
│   ├── app.py                # Main entry point of the Flask application
│   ├── routes
│   │   └── __init__.py       # Route definitions for the application
│   └── templates
│       └── index.html        # HTML template for the main page
├── tests
│   └── test_app.py           # Unit tests for the application
├── Dockerfile                 # Dockerfile for building the application image
├── docker-compose.yml         # Docker Compose configuration
├── Jenkinsfile                # Jenkins pipeline configuration
└── requirements.txt           # Python dependencies
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd flask-app
   ```

2. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

3. **Run the application:**
   ```
   python src/app.py
   ```

4. **Access the application:**
   Open your web browser and go to `http://localhost:5000`.

## Dockerization

To build and run the application using Docker, follow these steps:

1. **Build the Docker image:**
   ```
   docker build -t flask-app .
   ```

2. **Run the Docker container:**
   ```
   docker run -p 5000:5000 flask-app
   ```

## Continuous Integration and Deployment

This project is configured to work with Jenkins for continuous integration and deployment. The `Jenkinsfile` contains the necessary steps to build, test, and deploy the application.

## Testing

To run the tests, use the following command:

```
pytest tests/test_app.py
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.