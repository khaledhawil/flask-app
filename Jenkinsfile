#!/usr/bin/env groovy

pipeline {
    agent any
    
    stages {
        stage("build") {
            steps {
                script {
                    def gv = load "script.groovy"
                    gv.buildImage()
                }
            }
        }
        stage("deploy") {
            steps {
                script {
                    def gv = load "script.groovy"
                    gv.deployApp()
                }
            }
        }
    }
    
    post {
        always {
            script {
                def gv = load "script.groovy"
                gv.cleanup()
            }
        }
        failure {
            sh 'docker stop flask-app || true'
            sh 'docker rm flask-app || true'
        }
    }
}
