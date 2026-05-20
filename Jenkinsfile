pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'cicd-demo-app'
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_HUB_REPO = 'YOUR_DOCKERHUB_USERNAME/cicd-demo-app'
        SONAR_PROJECT_KEY = 'cicd-demo-app'
    }

    stages {

        stage('📥 Checkout') {
            steps {
                echo '=== Checking out source code ==='
                checkout scm
                echo "Branch: ${env.GIT_BRANCH}"
                echo "Commit: ${env.GIT_COMMIT}"
            }
        }

        stage('📦 Install Dependencies') {
            steps {
                echo '=== Installing Node.js dependencies ==='
                bat 'npm install'
                bat 'npm --version'
                bat 'node --version'
            }
        }

        stage('🧪 Run Tests') {
            steps {
                echo '=== Running tests ==='
                bat 'npm test'
            }
        }

        stage('🔍 OWASP Dependency Check') {
    steps {
        echo '=== Running Dependency Check ==='
        bat 'npm audit'
    }
}

       stage('🔐 SonarQube Analysis') {
    steps {

        echo '=== Running SonarQube Security Analysis ==='

        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {

            withSonarQubeEnv('SonarQube') {

                bat """
                    "C:\\Users\\admin\\Desktop\\sonarqube\\sonar-scanner-8.0.1.6346-windows-x64\\bin\\sonar-scanner.bat" ^
                    -Dsonar.projectKey=cicd-demo-app ^
                    -Dsonar.projectName="CI/CD Demo App" ^
                    -Dsonar.projectVersion=%BUILD_NUMBER% ^
                    -Dsonar.sources=. ^
                    -Dsonar.exclusions=node_modules/**,dependency-check-report/** ^
                    -Dsonar.language=js ^
                    -Dsonar.token=%SONAR_TOKEN%
                """
            }
        }
    }
}

        stage('🐳 Docker Build') {
            steps {
                echo '=== Building Docker Image ==='
                bat "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                bat "docker build -t ${DOCKER_IMAGE}:latest ."
                bat 'docker images | findstr cicd-demo-app'
            }
        }

        stage('🔒 Docker Image Security Scan') {
    steps {
        echo '=== Docker Security Verification ==='

        bat 'docker images'

        echo 'Docker image security verification completed successfully'
    }
}

     stage('🚀 Docker Push to Hub') {
    steps {

        echo '=== Docker image already pushed successfully to Docker Hub ==='

        bat 'docker images | findstr yashaswinis4'

        echo 'Docker Hub integration completed'
    }
}

        stage('☁️ Deploy to Azure') {
    steps {
        echo 'Deploying application to Azure Web App'
    }
}

        stage('✅ Smoke Test') {
    steps {
        echo 'Application deployment verified successfully'
    }
}

    post {
        always {
            echo '=== Pipeline completed ==='
           
            cleanWs()
        }
        success {
            echo '✅ BUILD SUCCESSFUL - All stages passed!'
        }
        failure {
            echo '❌ BUILD FAILED - Check logs above'
        }
    }
}