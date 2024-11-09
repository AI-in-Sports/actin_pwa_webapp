pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                docker compose -f ../docker-compose.yaml logs
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
                docker compose -f ../docker-compose.yaml logs
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                docker compose -f ../docker-compose.yaml logs
            }
        }
    }
}