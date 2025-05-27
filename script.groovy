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
        
        echo "Container deployed successfully!"
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
