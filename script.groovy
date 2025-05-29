def buildImage() {
    echo "Building the docker image..."
    try {
        sh 'docker --version'
        sh 'chmod -R 755 src/'
        withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
            sh "docker build -t khaledhawil/flask-app:${BUILD_NUMBER} -t khaledhawil/flask-app:latest ."
            sh "echo $PASS | docker login -u $USER --password-stdin"
            sh "docker push khaledhawil/flask-app:${BUILD_NUMBER}"
            sh "docker push khaledhawil/flask-app:latest"
        }
    } catch (Exception e) {
        echo "Build failed: ${e.getMessage()}"
        throw e
    } finally {
        sh 'docker logout || true'
    }
}

def deployApp() {
    echo 'Deploying the application...'
    sh '''
        docker stop flask-app || true
        docker rm flask-app || true
        docker volume create flask_data || true
        docker network create flask-network || true
        docker run -d \
            -p 5000:5000 \
            --name flask-app \
            --restart unless-stopped \
            --network flask-network \
            -v flask_data:/app/data \
            -e SECRET_KEY=production-secret-key-${BUILD_NUMBER} \
            -e FLASK_ENV=production \
            khaledhawil/flask-app:${BUILD_NUMBER}
    '''
}

def healthCheck() {
    echo 'Performing health check on deployed application...'
    sleep 10
    sh '''
        if ! docker ps --filter "name=flask-app" --format '{{.Names}}' | grep -q "flask-app"; then
            echo "Container is not running!"
            exit 1
        fi
        MAX_RETRIES=30
        RETRY_COUNT=0
        until curl -s http://localhost:5000/ > /dev/null || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
            echo "Waiting for application to respond... ($RETRY_COUNT/$MAX_RETRIES)"
            RETRY_COUNT=$((RETRY_COUNT+1))
            sleep 2
        done
        if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
            echo "Application failed to respond within expected time!"
            docker logs flask-app
            exit 1
        fi
        echo "Application is healthy and responding!"
    '''
}

def cleanup() {
    echo 'Cleaning up old images...'
    sh '''
        docker images khaledhawil/flask-app --format "{{.Repository}}:{{.Tag}}" | grep -v latest | sort -r | tail -n +4 | xargs -r docker rmi || true
        docker image prune -f
    '''
}

return this
