#!/usr/bin/env groovy

pipeline {
    agent any
    
    stages {
        stage("build") {
            steps {
                script {
                    def gv = load "pipeline.groovy"
                    gv.buildImage()
                }
            }
        }
        stage("deploy") {
            steps {
                script {
                    def gv = load "pipeline.groovy"
                    gv.deployApp()
                }
            }
        }
    }
    
    post {
        always {
            script {
                // Only cleanup if deployment was successful
                if (currentBuild.currentResult != 'FAILURE') {
                    def gv = load "pipeline.groovy"
                    gv.cleanup()
                }
            }
        }
        failure {
            script {
                echo "Pipeline failed. Checking deployment status..."
                // Add any failure handling logic here
            }
        }
    }
}