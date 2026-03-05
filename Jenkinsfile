pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t easystay-app .'
            }
        }

        stage('Run Docker Container') {
            steps {
                sh '''
                docker stop easystay-container || true
                docker rm easystay-container || true
                docker run -d -p 3000:3000 --name easystay-container easystay-app
                '''
            }
        }

    }
}