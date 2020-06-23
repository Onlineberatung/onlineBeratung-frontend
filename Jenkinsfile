pipeline {
	agent any
	environment {
			ARTIFACT_TAG = "${BRANCH_NAME}-${BUILD_ID}"
    }
  stages {
    stage('Build') {
        agent {
            docker {
                image 'node:8.13.0-jessie'
            }
        }
        steps {
            echo 'Build with...'
            sh 'npm --version'
            echo 'Start build...'
            sh 'npm install'
            sh 'npm run-script build'
						stash includes: 'dist/**/*', name: 'buildfiles'
        }
    }
		stage('Docker build') {
        	steps {
        		echo 'Creating Docker Container..'
        		unstash 'buildfiles'
        		sh 'docker build --no-cache -t ${DOCKER_REGISTRY}/${ARTIFACT_GROUP}/${ARTIFACT_NAME_FRONTEND} .'
        	}
        }
        stage('Docker push') {
        	agent any
        	steps {
        		echo 'Pushing Docker Container to repository..'
        		script {
                    docker.withRegistry(DOCKER_REGISTRY_URL, DOCKER_REGISTRY_CREDENTIALS_ID) {
                        docker.image("${DOCKER_REGISTRY}/${ARTIFACT_GROUP}/${ARTIFACT_NAME_FRONTEND}").push('${ARTIFACT_TAG}')
                    }
                }
        	}
        }
  }
}
