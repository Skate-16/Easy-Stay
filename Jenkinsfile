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
                docker stop easystay-container
                docker rm easystay-container
                docker run -d -p 3000:3000 --name easystay-container easystay-app
                '''
            }
        }

    }
}