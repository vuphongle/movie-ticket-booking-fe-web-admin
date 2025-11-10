# 🌐 Hướng dẫn Fix DNS cho gocinema.io.vn

## ❌ Vấn đề hiện tại

Domain `gocinema.io.vn` đang trỏ đến **2 IP addresses**:

- `112.213.89.150` ← **IP CŨ** (hosting/server cũ, trả về trang PHP landing page)
- `104.248.157.211` ← **IP MỚI** (VPS DigitalOcean, ứng dụng React)

Do DNS Round Robin, trình duyệt có thể kết nối đến IP cũ, dẫn đến hiển thị sai nội dung.

## ✅ Giải pháp

### Bước 1: Truy cập DNS Management Panel

Đăng nhập vào nhà cung cấp domain của bạn (VD: GoDaddy, Namecheap, CloudFlare, v.v.)

### Bước 2: Xóa bản ghi DNS cũ

Tìm và **XÓA** các bản ghi A record trỏ đến `112.213.89.150`:

```
Type: A
Name: @
Value: 112.213.89.150  ← XÓA CÁI NÀY
```

```
Type: A
Name: www
Value: 112.213.89.150  ← XÓA CÁI NÀY (nếu có)
```

### Bước 3: Giữ lại HOẶC thêm bản ghi DNS mới

Đảm bảo CHỈ có các bản ghi sau:

```
Type: A
Name: @
Value: 104.248.157.211
TTL: 600 (hoặc Auto)
```

```
Type: A
Name: www
Value: 104.248.157.211
TTL: 600 (hoặc Auto)
```

```
Type: A
Name: admin
Value: 104.248.157.211
TTL: 600 (hoặc Auto)
```

### Bước 4: Flush DNS Cache (sau khi update)

Sau khi cập nhật DNS, thực hiện:

**Trên macOS:**

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

**Trên Windows:**

```cmd
ipconfig /flushdns
```

**Trên Linux:**

```bash
sudo systemd-resolve --flush-caches
```

### Bước 5: Kiểm tra DNS đã cập nhật

```bash
# Kiểm tra DNS records
nslookup gocinema.io.vn

# Hoặc dùng dig
dig gocinema.io.vn +short

# Kiểm tra từ nhiều DNS servers
nslookup gocinema.io.vn 8.8.8.8  # Google DNS
nslookup gocinema.io.vn 1.1.1.1  # Cloudflare DNS
```

**Kết quả mong đợi:** CHỈ thấy `104.248.157.211`

### Bước 6: Test domain

```bash
# Test với curl
curl -I http://gocinema.io.vn

# Test với browser
open http://gocinema.io.vn
```

## ⏱️ Thời gian cập nhật DNS

- **Local cache**: 0-5 phút
- **ISP cache**: 5-30 phút
- **Global propagation**: 24-48 giờ (tối đa)

💡 **Tip:** Giảm TTL xuống 300-600 seconds trước khi thay đổi DNS để cập nhật nhanh hơn.

## 🔍 Troubleshooting

### Vẫn thấy trang cũ sau khi update DNS?

1. **Clear browser cache**: Ctrl+Shift+Del (hoặc Cmd+Shift+Del trên Mac)
2. **Dùng Incognito/Private mode** để test
3. **Dùng VPN hoặc mobile data** để test từ IP khác
4. **Chờ thêm 30-60 phút** để DNS propagate

### Kiểm tra IP nào đang được sử dụng

```bash
curl -v http://gocinema.io.vn 2>&1 | grep "Connected to"
```

Nếu thấy `Connected to gocinema.io.vn (112.213.89.150)` → Vẫn đang dùng IP cũ  
Nếu thấy `Connected to gocinema.io.vn (104.248.157.211)` → ✅ Đã dùng IP mới

## 📞 Support

Nếu vẫn gặp vấn đề, liên hệ:

- Email support của nhà cung cấp domain
- Hoặc check DNS propagation tại: https://www.whatsmydns.net/

---

**Cập nhật lần cuối:** October 20, 2025
