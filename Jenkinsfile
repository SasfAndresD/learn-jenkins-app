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
        NETLIFY_SITE_ID = 'nfp_aLufZ9Zqi2RcUB8LBH7RjuDu3yqBiPet7056'
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
                    node_modules/.bin/netlify link --id $NETLIFY_SITE_ID
                    echo "Deploying to production: Site ID: $NETLIFY_SITE_ID"
                    node_modules/.bin/netlify status
                    node_modules/.bin/netlify deploy --dir=build --prod
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
