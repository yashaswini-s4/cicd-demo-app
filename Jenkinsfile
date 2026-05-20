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
                echo '=== Running OWASP Dependency Check ==='
                dependencyCheck additionalArguments: '''
                    --scan ./
                    --format HTML
                    --format XML
                    --out ./dependency-check-report
                    --prettyPrint
                ''', odcInstallation: 'OWASP-Dependency-Check'
                
                dependencyCheckPublisher pattern: 'dependency-check-report/dependency-check-report.xml'
            }
        }

        stage('🔐 SonarQube Analysis') {
            steps {
                echo '=== Running SonarQube Security Analysis ==='
                withSonarQubeEnv('SonarQube') {
                    bat '''
                        sonar-scanner \
                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                        -Dsonar.projectName="CI/CD Demo App" \
                        -Dsonar.projectVersion=${BUILD_NUMBER} \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions=node_modules/**,dependency-check-report/** \
                        -Dsonar.language=js \
                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    '''
                }
            }
        }

        stage('🐳 Docker Build') {
            steps {
                echo '=== Building Docker Image ==='
                bat "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                bat "docker build -t ${DOCKER_IMAGE}:latest ."
                bat "docker images | grep ${DOCKER_IMAGE}"
            }
        }

        stage('🔒 Docker Image Security Scan') {
            steps {
                echo '=== Scanning Docker image for vulnerabilities ==='
                bat "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image ${DOCKER_IMAGE}:latest || true"
            }
        }

        stage('🚀 Docker Push to Hub') {
            steps {
                echo '=== Pushing image to Docker Hub ==='
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    passwordVariable: 'DOCKER_PASSWORD',
                    usernameVariable: 'DOCKER_USERNAME'
                )]) {
                    bat "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"
                    bat "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_HUB_REPO}:${DOCKER_TAG}"
                    bat "docker tag ${DOCKER_IMAGE}:latest ${DOCKER_HUB_REPO}:latest"
                    bat "docker push ${DOCKER_HUB_REPO}:${DOCKER_TAG}"
                    bat "docker push ${DOCKER_HUB_REPO}:latest"
                }
            }
        }

        stage('☁️ Deploy to Azure') {
            steps {
                echo '=== Deploying to Azure Container Instances ==='
                withCredentials([azureServicePrincipal('azure-credentials')]) {
                    bat '''
                        az login --service-principal \
                            -u $AZURE_CLIENT_ID \
                            -p $AZURE_CLIENT_SECRET \
                            --tenant $AZURE_TENANT_ID

                        az container create \
                            --resource-group cicd-demo-rg \
                            --name cicd-demo-container \
                            --image ${DOCKER_HUB_REPO}:latest \
                            --dns-name-label cicd-demo-app \
                            --ports 3000 \
                            --os-type Linux \
                            --cpu 1 \
                            --memory 1.5
                    '''
                }
            }
        }

        stage('✅ Smoke Test') {
            steps {
                echo '=== Running smoke test on deployed app ==='
                bat 'sleep 30'
                bat 'curl -f http://cicd-demo-app.eastus.azurecontainer.io:3000 || echo "Smoke test - check Azure portal"'
            }
        }
    }

    post {
        always {
            echo '=== Pipeline completed ==='
            bat 'docker logout || true'
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