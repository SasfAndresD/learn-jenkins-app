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
        NETLIFY_SITE_ID = '08a9c4a9-a56d-4b12-97d5-38e16d9d3b5a'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
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
                    npm install netlify-cli
                    node_modules/.bin/netlify --version
                    echo "Deploying to production: Site ID: $NETLIFY_SITE_ID"
                    node_modules/.bin/netlify status
                    node_modules/.bin/netlify deploy --dir=build --prod
                    echo 'End of deploy'
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