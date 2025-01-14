pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            reuseNode true
        }
    }
    
    triggers {
        githubPush()
    }
    
    environment {
        NETLIFY_SITE_ID = '08a9c4a9-a56d-4b12-97d5-38e16d9d3b5a'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
        NODE_TLS_REJECT_UNAUTHORIZED = '0'
        NEW_RELIC_LICENSE_KEY = credentials('new-relic-license-key')
        NEW_RELIC_APP_NAME = 'Tu-Aplicacion'
        NODE_ENV = 'production'
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                sh '''
                    node --version
                    npm --version
                    npm ci
                '''
            }
        }
        
        stage('New Relic Setup') {
            steps {
                sh '''
                    # Verificar si newrelic.js existe
                    if [ ! -f newrelic.js ]; then
                        echo "Creando configuración de New Relic..."
                        # Crear archivo de configuración con la licencia desde las variables de entorno
                        cat > newrelic.js << 'EOL'
'use strict'
exports.config = {
    app_name: ['${NEW_RELIC_APP_NAME}'],
    license_key: '${NEW_RELIC_LICENSE_KEY}',
    logging: {
        level: 'info'
    },
    distributed_tracing: {
        enabled: true
    },
    allow_all_headers: true
}
EOL
                    fi
                '''
            }
        }
        
        stage('Build') {
            steps {
                sh '''
                    npm run build
                    ls -la build/
                '''
            }
        }
        
        stage('Test') {
            steps {
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
        success {
            sh '''
                # Notificar a New Relic sobre el deployment
                curl -X POST "https://api.newrelic.com/v2/applications/deployment.json" \
                     -H "X-Api-Key: ${NEW_RELIC_LICENSE_KEY}" \
                     -H "Content-Type: application/json" \
                     -d "{
                           \"deployment\": {
                             \"revision\": \"${GIT_COMMIT}\",
                             \"changelog\": \"Jenkins Build #${BUILD_NUMBER}\",
                             \"description\": \"Deployed via Jenkins Pipeline\",
                             \"user\": \"Jenkins\"
                           }
                         }"
            '''
        }
    }
}