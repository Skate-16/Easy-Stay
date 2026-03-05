pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                git 'https://github.com/Skate-16/Easy-Stay.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t easystay .'
            }
        }

        stage('Run Docker Container') {
            steps {
                sh '''
                docker stop easystay-container || true
                docker rm easystay-container || true
                docker run -d -p 3000:3000 --name easystay-container easystay
                '''
            }
        }

    }
}