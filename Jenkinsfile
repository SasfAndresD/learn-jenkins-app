pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            reuseNode true
        }
    }
    triggers{
        githubPush()
    }
    environment {
        VERCEL_TOKEN = credentials('vercel-token')
        VERCEL_ORG_ID = 'andres-projects-8af9364a'
        VERCEL_PROJECT_ID = 'prj_gLVGXXCgYnBDJEh0KbS4dSLAkepU'
        NODE_TLS_REJECT_UNAUTHORIZED = '0'
    }
    stages {
        stage('Build') {
            steps {
                sh '''
                    ls -la
                    node --version
                    npm --version
                    npm ci
                    npm run build
                    ls -la
                '''
            }
        }

        stage('Test'){
            steps{
                sh '''
                    test -f build/index.html
                    npm test
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    npm install vercel
                    node_modules/.bin/vercel --version
                    vercel deploy build \
                        --token ${VERCEL_TOKEN} \
                        --prod \
                        --yes \
                        --scope ${VERCEL_ORG_ID} \
                        --project-id ${VERCEL_PROJECT_ID}
                    
                    echo 'Fin del deploy'
                '''
            }
        }
        stage('Verificar Deployment') {
            steps {
                sleep 5

                sh 'curl https://${VERCEL_PROJECT_ID}.vercel.app'
            }
        }
    }

    post {
        always {
            junit 'test-results/junit.xml'
        }
        cleanup {
            cleanWs()
        }
    }
}