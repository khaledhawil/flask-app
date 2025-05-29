#!/usr/bin/env groovy

pipeline {
    agent any

    environment {
        IMAGE_NAME = "khaledhawil/flask-app:${env.BUILD_NUMBER}"
        LATEST_IMAGE = "khaledhawil/flask-app:latest"
    }

    stages {
        stage('Prepare Workspace') {
            steps {
                cleanWs()
                sh 'chmod -R 777 . || true'
                checkout scm
            }
        }
        stage('Build & Push Docker Image') {
            steps {
                script {
                    def gv = load "script.groovy"
                    gv.buildImage()
                }
            }
        }
        stage('Deploy Container') {
            steps {
                script {
                    def gv = load "script.groovy"
                    gv.deployApp()
                }
            }
        }
        // stage('Health Check') {
        //     steps {
        //         script {
        //             def gv = load "script.groovy"
        //             gv.healthCheck()
        //         }
        //     }
        // }
    }
    post {
        always {
            script {
                def gv = load "script.groovy"
                gv.cleanup()
            }
        }
    //     failure {
    //         script {
    //             echo "Pipeline failed. Checking container logs..."
    //             sh 'docker logs flask-app || true'
    //             echo "Stopping and removing failed container..."
    //             sh 'docker stop flask-app || true'
    //             sh 'docker rm flask-app || true'
    //         }
    //     }
    // }
}
}