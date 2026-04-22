pipeline {
    agent any

    // environment {
    //     AZURE_APP_URL = "https://easy-stay-dudzcsevg5bweahh.southeastasia-01.azurewebsites.net"
    // }

    stages {

        stage('Start SonarQube Community Container') {
            steps {
                bat '''
                docker start sonarqube 2>nul || docker run -d -p 9000:9000 --name sonarqube sonarqube:community

                echo Waiting for SonarQube to start...

                :loop
                powershell -Command "(Invoke-WebRequest http://localhost:9000/api/system/status -UseBasicParsing).Content" | find "UP"
                if errorlevel 1 (
                    timeout /t 5 >nul
                    goto loop
                )

                echo SonarQube is ready
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('SonarQube SAST Scan') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner'
                    withSonarQubeEnv('SonarQube') {
                        bat "\"${scannerHome}\\bin\\sonar-scanner.bat\""
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t easystay-app .'
            }
        }

        // stage('Trivy Image Scan') {
        //     steps {
        //         bat '''
        //         docker run --rm aquasec/trivy image easystay-app
        //         '''
        //     }
        // }

        stage('Run Docker Container') {
            steps {
                withCredentials([
                    string(credentialsId: 'CLOUD_NAME', variable: 'CLOUD_NAME'),
                    string(credentialsId: 'CLOUD_API_KEY', variable: 'CLOUD_API_KEY'),
                    string(credentialsId: 'CLOUD_API_SECRET', variable: 'CLOUD_API_SECRET'),
                    string(credentialsId: 'MAP_TOKEN', variable: 'MAP_TOKEN'),
                    string(credentialsId: 'ATLASDB_URL', variable: 'ATLASDB_URL'),
                    string(credentialsId: 'SECRET', variable: 'SECRET'),
                    string(credentialsId: 'RAZORPAY_KEY_ID', variable: 'RAZORPAY_KEY_ID'),
                    string(credentialsId: 'RAZORPAY_KEY_SECRET', variable: 'RAZORPAY_KEY_SECRET'),
                    string(credentialsId: 'GOOGLE_CLIENT_ID', variable: 'GOOGLE_CLIENT_ID'),
                    string(credentialsId: 'GOOGLE_CLIENT_SECRET', variable: 'GOOGLE_CLIENT_SECRET'),
                    string(credentialsId: 'GOOGLE_CALLBACK_URL', variable: 'GOOGLE_CALLBACK_URL')
                ]) {

                    bat '''
                    docker rm -f easystay-container 2>nul

                    docker run -d -p 3000:3000 ^
                    -e CLOUD_NAME="%CLOUD_NAME%" ^
                    -e CLOUD_API_KEY="%CLOUD_API_KEY%" ^
                    -e CLOUD_API_SECRET="%CLOUD_API_SECRET%" ^
                    -e MAP_TOKEN="%MAP_TOKEN%" ^
                    -e ATLASDB_URL="%ATLASDB_URL%" ^
                    -e SECRET="%SECRET%" ^
                    -e RAZORPAY_KEY_ID="%RAZORPAY_KEY_ID%" ^
                    -e RAZORPAY_KEY_SECRET="%RAZORPAY_KEY_SECRET%" ^
                    -e GOOGLE_CLIENT_ID="%GOOGLE_CLIENT_ID%" ^
                    -e GOOGLE_CLIENT_SECRET="%GOOGLE_CLIENT_SECRET%" ^
                    -e GOOGLE_CALLBACK_URL="%GOOGLE_CALLBACK_URL%" ^
                    --name easystay-container easystay-app
                    '''
                }
            }
        }

        stage('OWASP ZAP DAST Scan (Azure App)') {
            steps {
                bat '''
                docker rm -f zapscan 2>nul

                docker run -d --name zapscan ^
                ghcr.io/zaproxy/zaproxy:stable zap-baseline.py ^
                -t %AZURE_APP_URL% ^
                -r zap-report.html

                docker wait zapscan

                docker cp zapscan:/zap/zap-report.html zap-report.html

                docker rm zapscan
                '''
            }
        }

    }
}