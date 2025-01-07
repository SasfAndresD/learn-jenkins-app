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
                    npm install -g vercel
                    vercel --version
                    if [ ! -f vercel.json ]; then
                        echo '{
                            "version": 2,
                            "builds": [
                                {
                                    "src": "build/**",
                                    "use": "@vercel/static"
                                }
                            ],
                            "routes": [
                                { "handle": "filesystem" },
                                { "src": "/(.*)", "dest": "/build/index.html" }
                            ]
                        }' > vercel.json
                    fi
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
    }

    post {
        always {
            junit 'test-results/junit.xml'
        }
    }
}
