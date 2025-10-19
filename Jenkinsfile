pipeline {
  agent any
  environment {
    IMAGE_BASE = "vuphongle23/movie-ticket-booking-fe-admin"
    COMMIT     = "${env.GIT_COMMIT ?: 'local'}"
    TAG_LATEST = "${IMAGE_BASE}:latest"
    TAG_BUILD  = "${IMAGE_BASE}:${env.BUILD_NUMBER}"
    
    // VPS Configuration
    VPS_HOST = "159.223.38.127"
    VPS_USER = "root"
    DEPLOY_PATH = "/opt/movie-ticket-booking-fe-admin"
  }
  options {
    timestamps()
  }
  stages {
    stage('Checkout') {
      steps {
        git branch: 'dev',
            url: 'https://github.com/vuphongle/movie-ticket-booking-fe-web-admin.git'
      }
    }

    stage('Build Image') {
      steps {
        script {
          docker.build("${TAG_BUILD}")
        }
      }
    }

    stage('Tag Latest') {
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

    stage('Deploy to VPS') {
      steps {
        script {
          withCredentials([sshUserPrivateKey(credentialsId: 'vps-ssh-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
            sh """
              ssh -i \${SSH_KEY} -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} '
                cd ${DEPLOY_PATH} && \
                docker-compose pull frontend-admin && \
                docker-compose up -d frontend-admin && \
                docker-compose ps
              '
            """
          }
        }
      }
    }
  }
  
  post {
    success {
      echo "✅ Frontend build, push và deploy thành công!"
      echo "Image: ${TAG_BUILD}"
      echo "Latest: ${TAG_LATEST}"
      echo "Deployed to: ${VPS_HOST}"
    }
    failure {
      echo "❌ Frontend pipeline thất bại!"
    }
    always {
      sh 'docker system prune -f || true'
    }
  }
}
