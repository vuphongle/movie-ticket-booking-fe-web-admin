# 🚀 Frontend Admin Deployment Guide

## 📦 Tech Stack
- React 18
- TypeScript
- Vite
- Ant Design
- Redux Toolkit
- Docker + Nginx

## 🎯 Architecture
```
Browser → Nginx (port 80) → Backend API (port 8080) → MariaDB (port 3306)
```

## 📋 Prerequisites
- Docker và Docker Compose installed
- Backend container đã chạy
- Jenkins đã build và push image lên Docker Hub

## 🚀 Quick Deploy (Recommended)

### Option 1: Standalone Frontend Container

```bash
# 1. SSH vào VPS
ssh root@128.199.113.207

# 2. Pull image mới nhất
docker pull vuphongle23/movie-ticket-booking-fe-admin:latest

# 3. Run frontend container
docker run -d \
  --name movie-booking-frontend-admin \
  --network movie-ticket-booking-be_movie-booking-network \
  -p 80:80 \
  --restart unless-stopped \
  vuphongle23/movie-ticket-booking-fe-admin:latest

# 4. Kiểm tra
docker ps | grep frontend
docker logs movie-booking-frontend-admin
```

### Option 2: Deploy Script

```bash
# Trên VPS
cd /root
git clone https://github.com/vuphongle/movie-ticket-booking-fe-web-admin.git
cd movie-ticket-booking-fe-web-admin

# Run deployment script
chmod +x deploy-fe.sh
./deploy-fe.sh
```

### Option 3: Docker Compose (Full Stack)

```bash
# Copy docker-compose.full.yml và .env vào VPS
# Sau đó:
docker compose -f docker-compose.full.yml up -d
```

## 🔄 Update Frontend (Sau khi Jenkins build mới)

```bash
# Cách 1: Manual
docker pull vuphongle23/movie-ticket-booking-fe-admin:latest
docker stop movie-booking-frontend-admin
docker rm movie-booking-frontend-admin
docker run -d \
  --name movie-booking-frontend-admin \
  --network movie-ticket-booking-be_movie-booking-network \
  -p 80:80 \
  --restart unless-stopped \
  vuphongle23/movie-ticket-booking-fe-admin:latest

# Cách 2: Dùng script
cd movie-ticket-booking-fe-web-admin
./deploy-fe.sh
```

## 🐳 Build Local (Development)

```bash
# Clone repository
git clone https://github.com/vuphongle/movie-ticket-booking-fe-web-admin.git
cd movie-ticket-booking-fe-web-admin

# Install dependencies
npm install

# Run development
npm run dev
# Truy cập: http://localhost:3001

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐋 Build Docker Image Local

```bash
# Build image
docker build -t movie-ticket-booking-fe-admin:latest .

# Run local
docker run -d \
  --name frontend-admin \
  -p 80:80 \
  movie-ticket-booking-fe-admin:latest

# Test
curl http://localhost
```

## 📊 Monitoring & Debugging

### Check container status
```bash
docker ps -a | grep frontend
docker logs movie-booking-frontend-admin -f
docker stats movie-booking-frontend-admin
```

### Check nginx inside container
```bash
docker exec movie-booking-frontend-admin nginx -t
docker exec movie-booking-frontend-admin cat /etc/nginx/conf.d/default.conf
```

### Test API connectivity from frontend container
```bash
docker exec movie-booking-frontend-admin wget -O- http://movie-booking-backend:8080/actuator/health
```

### Access container shell
```bash
docker exec -it movie-booking-frontend-admin sh
```

## 🔧 Troubleshooting

### Frontend không kết nối được Backend

1. **Kiểm tra network:**
```bash
docker network inspect movie-ticket-booking-be_movie-booking-network
```

2. **Kiểm tra backend container name:**
```bash
docker ps | grep backend
```

3. **Test connection:**
```bash
docker exec movie-booking-frontend-admin ping movie-booking-backend
```

### Port 80 đã được sử dụng

```bash
# Tìm process đang dùng port 80
lsof -i :80

# Stop service khác (ví dụ: apache2)
systemctl stop apache2
systemctl disable apache2
```

### CORS errors

Kiểm tra nginx.conf có cấu hình CORS đúng không:
```bash
docker exec movie-booking-frontend-admin cat /etc/nginx/conf.d/default.conf | grep -A 5 "Access-Control"
```

## 🌐 Access URLs

- **Frontend Admin**: `http://128.199.113.207` (port 80)
- **Backend API**: `http://128.199.113.207:8080`
- **Health Check**: `http://128.199.113.207/api/actuator/health`

## 🔒 Security Best Practices

1. **Setup HTTPS với Let's Encrypt** (recommended)
2. **Enable firewall**
3. **Use environment variables cho sensitive data**
4. **Regular updates** cho Docker images
5. **Implement rate limiting** trong nginx
6. **Add authentication** cho admin panel

## 📝 Jenkins CI/CD Setup

1. Tạo Jenkins pipeline cho FE repo
2. Sử dụng Jenkinsfile đã tạo
3. Configure webhook từ GitHub
4. Auto deploy sau khi build thành công

## 🎯 Next Steps

- [ ] Setup HTTPS/SSL certificate
- [ ] Configure custom domain
- [ ] Setup monitoring (Prometheus + Grafana)
- [ ] Implement auto-deployment webhook
- [ ] Setup backup strategy
- [ ] Configure CDN (CloudFlare)
