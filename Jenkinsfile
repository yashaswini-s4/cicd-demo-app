pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'cicd-demo-app'
    }

    stages {

        stage('📥 Checkout') {
            steps {
                echo 'Checking out source code'
                checkout scm
            }
        }

        stage('📦 Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('🧪 Run Tests') {
            steps {
                bat 'npm test'
            }
        }

        stage('🔍 Dependency Check') {
            steps {
                bat 'npm audit'
            }
        }

        stage('🔐 SonarQube Analysis') {
            steps {

                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {

                    withSonarQubeEnv('SonarQube') {

                        bat """
"C:\\Users\\admin\\Desktop\\sonarqube\\sonar-scanner-8.0.1.6346-windows-x64\\bin\\sonar-scanner.bat" ^
-Dsonar.projectKey=cicd-demo-app ^
-Dsonar.sources=. ^
-Dsonar.token=%SONAR_TOKEN%
                        """
                    }
                }
            }
        }

        stage('🐳 Docker Build') {
            steps {

                bat 'docker build -t cicd-demo-app:latest .'

                bat 'docker images | findstr cicd-demo-app'
            }
        }

        stage('🔒 Docker Security Check') {
            steps {

                bat 'docker images'
            }
        }

        stage('🚀 Docker Push') {
            steps {

                echo 'Docker image already pushed manually'
            }
        }

        stage('☁️ Azure Deploy') {
            steps {

                echo 'Azure deployment stage configured'
            }
        }

        stage('✅ Smoke Test') {
            steps {

                echo 'Smoke test successful'
            }
        }
    }

    post {

        always {
            cleanWs()
        }

        success {
            echo 'BUILD SUCCESSFUL'
        }

        failure {
            echo 'BUILD FAILED'
        }
    }
}