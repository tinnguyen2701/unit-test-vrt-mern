pipeline {
    agent any
    stages {
        stage("inprogress") {
            steps {
                withCredentials([usernamePassword(credentialsId: '7e4ca6aa-cbdd-4a6f-91fd-72b6ac396caa', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD',)]) {
                    sh " curl -v -u $USERNAME:$PASSWORD -H \"Content-Type: application/json\" -X POST ${params.BUILD_STATUS_URL}/" + '$(git log -n 1 --pretty=format:"%H")' + " -d '{\"state\": \"INPROGRESS\", \"key\": \"${env.BUILD_ID}\", \"name\": \"Build #${env.BUILD_ID}\", \"url\": \"${env.BUILD_URL}\", \"description\": \"In Progress!\"}'"
                }
            }
        }

        stage("install") {
            steps {
                sh 'npm install'
            }
        }

        stage("unit test") {
            steps {
                sh 'CI=true npm test'
            }
        }

        // stage("visual regression test") {
        //     steps {
        //         sh 'npm run vrt:coverage:ci'
        //     }
        // }

	    stage("lint check") {
            steps {
                sh 'npm run lint'
            }
        }
    }
    post {
        success {
            withCredentials([usernamePassword(credentialsId: '7e4ca6aa-cbdd-4a6f-91fd-72b6ac396caa', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD',)]) {
                sh " curl -v -u $USERNAME:$PASSWORD -H \"Content-Type: application/json\" -X POST ${params.BUILD_STATUS_URL}/" + '$(git log -n 1 --pretty=format:"%H")' + " -d '{\"state\": \"SUCCESSFUL\", \"key\": \"${env.BUILD_ID}\", \"name\": \"Build #${env.BUILD_ID}\", \"url\": \"${env.BUILD_URL}\", \"description\": \"Successful!\"}'"
            }
        }
        failure {
            withCredentials([usernamePassword(credentialsId: '7e4ca6aa-cbdd-4a6f-91fd-72b6ac396caa', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD',)]) {
                sh " curl -v -u $USERNAME:$PASSWORD -H \"Content-Type: application/json\" -X POST ${params.BUILD_STATUS_URL}/" + '$(git log -n 1 --pretty=format:"%H")' + " -d '{\"state\": \"FAILED\", \"key\": \"${env.BUILD_ID}\", \"name\": \"Build #${env.BUILD_ID}\", \"url\": \"${env.BUILD_URL}\", \"description\": \"Something went wrong\"}'"
            }
        }
    }
}