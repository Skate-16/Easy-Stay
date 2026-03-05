pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t easystay-app .'
            }
        }

        stage('Run Docker Container') {
            steps {
                bat '''
                docker stop easystay-container || exit 0
                docker rm easystay-container || exit 0
                docker run -d -p 3000:3000 --env-file .env --name easystay-container easystay-app
                '''
            }
        }

    }
}