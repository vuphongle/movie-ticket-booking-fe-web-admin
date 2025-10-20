# 🚀 CI/CD Improvements - Deployment Safety

## 📋 Tổng quan

Jenkinsfile đã được cải tiến để đảm bảo **deployment an toàn** và **tự động phục hồi** khi có sự cố.

## ✨ Các cải tiến chính

### 1. **Isolated Deployment**

- Deploy admin **KHÔNG ảnh hưởng** đến user frontend
- Chỉ stop/restart container `movie-booking-frontend-admin`
- Các container khác (user, backend, nginx proxy) vẫn hoạt động bình thường

### 2. **Health Check Stage**

Sau khi deploy, pipeline tự động:

- ✅ Kiểm tra admin container đang chạy
- ✅ Kiểm tra user frontend đang chạy
- ✅ Kiểm tra nginx proxy đang hoạt động
- ✅ Test HTTP connectivity đến tất cả services

### 3. **Auto-Recovery Script**

Script `scripts/post-deploy-check.sh` tự động:

- Phát hiện nếu user frontend bị down
- Tự động restart user frontend container
- Đảm bảo nginx proxy hoạt động
- Verify connectivity sau khi recovery

### 4. **Detailed Logging**

Mỗi bước trong pipeline có logging rõ ràng:

```
📦 Pulling latest admin image...
🛑 Stopping old admin container...
🚀 Starting new admin container...
✅ Verifying admin container...
🔍 Checking nginx proxy status...
🏥 Health check - Admin frontend...
```

## 📊 Pipeline Stages

```
┌─────────────────┐
│   Checkout      │
└────────┬────────┘
         │
┌────────▼────────┐
│  Build Image    │
└────────┬────────┘
         │
┌────────▼────────┐
│   Tag Latest    │
└────────┬────────┘
         │
┌────────▼────────┐
│ Push to Docker  │
└────────┬────────┘
         │
┌────────▼────────┐
│  Deploy to VPS  │ ← Stop/Remove old admin only
└────────┬────────┘
         │
┌────────▼────────┐
│  Health Check   │ ← Verify all services + Auto-recovery
└─────────────────┘
```

## 🛡️ Safety Features

### Container Isolation

```groovy
// Chỉ tác động đến admin container
docker stop movie-booking-frontend-admin || true
docker rm -f movie-booking-frontend-admin || true
docker compose up -d frontend-admin
```

### Health Verification

```bash
# Kiểm tra admin
curl -f http://localhost:8081

# Kiểm tra user
curl -f http://localhost:3000

# Kiểm tra nginx
docker exec gocinema-nginx-proxy nginx -t
```

### Auto-Recovery

```bash
# Nếu user container down
if ! docker ps | grep -q movie-booking-frontend-user; then
    # Auto restart
    docker compose up -d frontend-user
fi
```

## 🔧 Cách sử dụng

### Trigger Pipeline

Pipeline tự động chạy khi:

- Push code lên branch `dev`
- Hoặc trigger thủ công từ Jenkins UI

### Monitor Pipeline

1. Truy cập Jenkins: http://159.223.38.127:8090
2. Chọn job: `movie-booking-admin`
3. Xem Console Output để theo dõi

### Xử lý lỗi

Nếu pipeline fail:

1. Kiểm tra Console Output để xem lỗi ở stage nào
2. User frontend vẫn hoạt động bình thường (không bị ảnh hưởng)
3. Fix lỗi và push lại code

## 🧪 Testing

### Local Testing

```bash
# Test health check script locally
cd /Users/vuphong/DATN/Code/movie-ticket-booking-fe-web-admin
./scripts/post-deploy-check.sh
```

### VPS Testing

```bash
# SSH vào VPS
ssh root@159.223.38.127

# Run health check manually
bash /tmp/post-deploy-check.sh
```

## 📈 Monitoring

### Container Status

```bash
ssh root@159.223.38.127 "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"
```

### Logs

```bash
# Admin logs
docker logs movie-booking-frontend-admin --tail 50

# User logs
docker logs movie-booking-frontend-user --tail 50

# Nginx logs
docker logs gocinema-nginx-proxy --tail 50
```

## 🎯 Best Practices

1. **Trước khi deploy:**
   - Verify code builds locally
   - Check Docker Hub có image mới chưa
   - Đảm bảo không có thay đổi breaking

2. **Trong quá trình deploy:**
   - Monitor Jenkins Console Output
   - Chờ Health Check stage hoàn thành

3. **Sau khi deploy:**
   - Test admin UI: http://admin.gocinema.io.vn
   - Verify user site vẫn hoạt động: http://gocinema.io.vn
   - Check logs nếu có vấn đề

## 🆘 Troubleshooting

### Admin container không start?

```bash
ssh root@159.223.38.127
cd /opt/movie-ticket-booking-fe-admin
docker compose logs frontend-admin
docker compose up -d --force-recreate frontend-admin
```

### User frontend bị down sau deploy?

```bash
# Auto-recovery sẽ tự động fix, hoặc manual:
cd /opt/movie-ticket-booking-fe-user
docker compose up -d --force-recreate frontend-user
```

### Nginx proxy không routing đúng?

```bash
docker exec gocinema-nginx-proxy nginx -t
docker restart gocinema-nginx-proxy
```

## 📚 Related Docs

- [DNS Fix Guide](./DNS-FIX-GUIDE.md) - Hướng dẫn fix DNS
- [Full Deployment Guide](./FULL-DEPLOYMENT-GUIDE.md) - Guide deploy toàn bộ hệ thống

---

**Maintained by:** Lê Vũ Phong  
**Last updated:** October 20, 2025
