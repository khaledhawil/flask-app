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
                // Only cleanup if deployment was successful
                if (currentBuild.currentResult != 'FAILURE') {
                    def gv = load "script.groovy"
                    gv.cleanup()
                }
            }
        }
        failure {
            script {
                echo "Pipeline failed. Checking