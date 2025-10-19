pipeline {
  agent any
  environment {
    IMAGE_BASE = "vuphongle23/movie-ticket-booking-fe-admin"
    COMMIT     = "${env.GIT_COMMIT ?: 'local'}"
    TAG_LATEST = "${IMAGE_BASE}:latest"
    TAG_BUILD  = "${IMAGE_BASE}:${env.BUILD_NUMBER}"
  }
  options {
    timestamps()
  }
  stages {
    stage('Checkout') {
      steps {
        git branch: 'main',
            url: 'https://github.com/vuphongle/movie-ticket-booking-fe-web-admin.git'
      }
    }

    stage('Build image') {
      steps {
        script {
          docker.build("${TAG_BUILD}")
        }
      }
    }

    stage('Tag latest') {
      steps {
        sh 'docker tag ${TAG_BUILD} ${TAG_LATEST}'
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push ${TAG_BUILD}
            docker push ${TAG_LATEST}
            docker logout
          '''
        }
      }
    }
  }
  
  post {
    success {
      echo "✅ Frontend build và push Docker image thành công!"
      echo "Image: ${TAG_BUILD}"
      echo "Latest: ${TAG_LATEST}"
    }
    failure {
      echo "❌ Frontend build thất bại!"
    }
    always {
      sh 'docker system prune -f || true'
    }
  }
}
