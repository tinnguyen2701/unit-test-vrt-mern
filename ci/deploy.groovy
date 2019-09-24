pipeline {
    agent any
    stages {
        stage("build") {
            steps {
                sh "cp ${ENV_TEST} ./.env"
                sh 'npm install'
                sh 'npm run build'
                sh "echo ${BUILD_NUMBER} > build/.version"
            }
        }

        stage("deploy") {
            steps {
                sh "rsync -auv --include=.env --include=/node_modules --include=/build --exclude-from=.gitignore --delete . testbox:${DEPLOY_TARGET}"
                sh "ssh testbox 'cd ${DEPLOY_TARGET} && pm2 delete -s ${APP_NAME} || : && pm2 --name=${APP_NAME} start npm -- run prod'"
            }
        }
    }
}