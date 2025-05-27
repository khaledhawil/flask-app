def buildImage() {
    echo "building the docker image..."
    try {
        withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
            sh "docker build -t khaledhawil/flask-app:${BUILD_NUMBER} ."
            sh "echo \$PASS | docker login -u \$USER --password-stdin"
            sh "docker push khaledhawil/flask-app:${BUILD_NUMBER}"
        }
    } catch (Exception e) {
        echo "Build failed: ${e.getMessage()}"
        throw e
    } finally {
        sh 'docker logout || true'
    }
}

def deployApp() {
    echo 'deploying the application...'
    sh """
        # Stop and remove existing container
        docker stop flask-app || true
        docker rm flask-app || true
        
        # Deploy new container
        docker run -d \\
            -p 5000:5000 \\
            --name flask-app \\
            --restart unless-stopped \\
            khaledhawil/flask-app:${BUILD_NUMBER}
        
        # Wait for container to start
        echo "Waiting for container to start..."
        sleep 30
        
        # Check container status
        echo "Container status:"
        docker ps | grep flask-app || echo "Container not running"
        
        # Check container logs
        echo "Container logs:"
        docker logs flask-app
        
        # Try health check with retries
        echo "Performing health check..."
        for i in 1 2 3 4 5; do
            echo "Health check attempt \$i/5"
            if curl -f http://localhost:5000 2>/dev/null; then
                echo "Health check passed!"
                exit 0
            fi
            echo "Health check failed, retrying in 10 seconds..."
            sleep 10
        done
        
        echo "All health checks failed"
        exit 1
    """
}

def cleanup() {
    echo 'cleaning up old images...'
    sh '''
        # Keep only last 5 images
        docker images khaledhawil/flask-app --format "{{.Tag}}" | grep -v latest | tail -n +6 | xargs -I {} docker rmi khaledhawil/flask-app:{} || true
    '''
}

return this
