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
        NEW_RELIC_LICENSE_KEY = credentials('B805FB6D024C228511C67D7F0EBA7DBB59B146F071621253487880FE420A90FB')
        NEW_RELIC_APP_NAME = 'jenkins-class'
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

        stage('Notify New Relic') {
            steps {
                sh '''
                    npm install newrelic-cli
                    newrelic deployments create \
                    --applicationName $NEW_RELIC_APP_NAME \
                    --user $(git config user.name) \
                    --revision $(git rev-parse HEAD) \
                    --description "Deploy desde Jenkins"
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