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
                echo "📦 Pulling latest admin image..." && \
                docker compose pull frontend-admin && \
                echo "🛑 Stopping old admin container..." && \
                docker stop movie-booking-frontend-admin || true && \
                docker rm -f movie-booking-frontend-admin || true && \
                echo "🚀 Starting new admin container..." && \
                docker compose up -d frontend-admin && \
                echo "✅ Verifying admin container..." && \
                sleep 3 && \
                docker ps | grep movie-booking-frontend-admin && \
                echo "🔍 Checking nginx proxy status..." && \
                docker ps | grep gocinema-nginx-proxy || echo "⚠️  Nginx proxy not found (optional)" && \
                echo "🧹 Cleaning up unused images..." && \
                docker image prune -f && \
                echo "📊 Final container status:" && \
                docker compose ps
              '
            """
          }
        }
      }
    }
    
    stage('Health Check') {
      steps {
        script {
          withCredentials([sshUserPrivateKey(credentialsId: 'vps-ssh-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
            sh """
              echo "📤 Uploading health check script to VPS..."
              scp -i \${SSH_KEY} -o StrictHostKeyChecking=no scripts/post-deploy-check.sh ${VPS_USER}@${VPS_HOST}:/tmp/post-deploy-check.sh
              
              echo "🏥 Running health check on VPS..."
              ssh -i \${SSH_KEY} -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} '
                chmod +x /tmp/post-deploy-check.sh && \
                /tmp/post-deploy-check.sh && \
                rm -f /tmp/post-deploy-check.sh
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
