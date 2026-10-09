# GÓC LẮNG NGHE – CÙNG EM TRƯỞNG THÀNH
### Website Tư Vấn Tâm Lý Học Đường, Hỗ Trợ Cảm Xúc & Kỹ Năng Sống Cho Học Sinh

> *Khẩu hiệu:* **“Mỗi cảm xúc đều đáng được lắng nghe – Mỗi học sinh đều xứng đáng được yêu thương và hỗ trợ.”**

---

## 1. TỔNG QUAN KIẾN TRÚC HỆ THỐNG

Hệ thống được thiết kế theo mô hình full-stack hiện đại, an toàn và phân quyền bảo mật cấp sư phạm:
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Responsive 100% trên Điện thoại, Máy tính bảng và Máy tính để bàn.
- **Dual Age Mode:**
  - *Chế độ Tiểu học:* Ngôn từ trong sáng, nút bấm lớn, hình ảnh thân thiện, tương tác cảm xúc trực quan và nút hỗ trợ khẩn cấp "Em cần người lớn giúp đỡ".
  - *Chế độ THCS:* Giao diện tôn trọng sự riêng tư, xử lý các chủ đề tuổi dậy thì, áp lực học tập, bắt nạt học đường và theo dõi phiếu tư vấn kín đáo.
- **Backend:** Node.js Express REST API, bảo mật nhiều lớp (Anti-XSS, Anti-CSRF headers, Brute-force IP Lockout, Rate Limiting, Payload Limiting 256KB).
- **Cơ sở dữ liệu:** PostgreSQL 16 / Cloud SQL (Region `asia-southeast1`) với Drizzle ORM & Connection Pooling.
- **Xác thực & RBAC:** Firebase Authentication kết hợp HMAC-SHA256 Session Token. Phân quyền chặt chẽ 5 vai trò: `STUDENT`, `PARENT`, `TEACHER`, `COUNSELOR`, `ADMIN`.
- **Trí tuệ nhân tạo (AI):** Trợ lý "Bạn Đồng Hành" tích hợp Google Gemini API (`gemini-3.8-flash`) phía server với bộ lọc an toàn đa tầng và cơ chế chuyển giao chuyên viên khẩn cấp (Hotline 111 & Phòng 204).

---

## 2. HƯỚNG DẪN KHỞI CHẠY HỆ THỐNG: PHÁT TRIỂN vs. PRODUCTION

### ❓ Vì sao trước đây ứng dụng yêu cầu `DATABASE_URL`?
1. File `prisma/schema.prisma` có khai báo `url = env("DATABASE_URL")`. Nếu bạn từng chạy lệnh liên quan đến Prisma, Prisma sẽ đòi biến này.
2. Theo chuẩn công nghiệp của Node.js & PostgreSQL, các thư viện kết nối thường tìm kiếm chuỗi `DATABASE_URL` để kết nối máy chủ database cục bộ cổng 5432.
3. Khi bạn chưa cài PostgreSQL trên máy, ứng dụng không có nơi lưu trữ thực tế nên sẽ báo lỗi kết nối.

---

### 🚀 A. Chế độ Phát triển (Development Mode) – KHÔNG CẦN DATABASE
> **Dành cho bạn muốn xem, duyệt và kiểm thử toàn bộ giao diện ngay lập tức mà chưa muốn cài đặt PostgreSQL!**

- **Bạn KHÔNG cần cài PostgreSQL hay cấu hình `DATABASE_URL`!**
- Hệ thống tích hợp sẵn **In-Memory Development Store** mô phỏng đầy đủ dữ liệu mẫu (5 tài khoản thử nghiệm các vai trò, các phiếu chia sẻ, lịch tư vấn, báo cáo bắt nạt, check-in cảm xúc, bài viết thư viện).
- **Tính minh bạch:** Hệ thống hiển thị biểu ngữ cảnh báo rõ ràng trên giao diện và trong API: *"Chế độ xem trước giao diện: Dữ liệu chỉ lưu tạm trong RAM và KHÔNG lưu vào database thực tế"*.

**Lệnh khởi chạy xem giao diện:**
```bash
# 1. Cài đặt các thư viện (nếu mới clone dự án)
npm install

# 2. Khởi chạy ngay (không cần cấu hình database)
npm run dev
```
👉 Mở trình duyệt tại: **http://localhost:3000** để trải nghiệm toàn bộ giao diện!
- Thử đăng nhập các vai trò demo tại trang **Tài khoản**:
  - `usr-student-01` (Em Nguyễn Minh An - Học sinh)
  - `usr-counselor-01` (Cô Hoàng Thúy Hà - Chuyên viên Tư vấn)
  - `usr-teacher-01` (Thầy Trần Quốc Tuấn - Giáo viên Chủ nhiệm)
  - `usr-parent-01` (Bác Nguyễn Văn Bình - Phụ huynh)
  - `usr-admin-01` (Thầy Lê Hải Đăng - Ban Giám Hiệu / Quản trị)
- Thử gửi phiếu chia sẻ, nhận mã tra cứu bảo mật, đặt lịch tư vấn, trò chuyện cùng trợ lý AI!

---

### 🏭 B. Chế độ Triển khai Thực tế (Production Mode) – YÊU CẦU `DATABASE_URL`
> **Dành cho khi đưa vào vận hành chính thức tại nhà trường.**

- Khi `NODE_ENV=production`, hệ thống **BẮT BUỘC** phải có `DATABASE_URL` hợp lệ kết nối tới máy chủ PostgreSQL thật.
- Server sẽ thực hiện kiểm tra kết nối (`SELECT 1`). Nếu chưa cấu hình hoặc kết nối thất bại, server sẽ **dừng ngay lập tức** và in thông báo lỗi chi tiết bằng tiếng Việt để bảo vệ an toàn dữ liệu học sinh, không bao giờ chạy giả lập in-memory trong production.

**Cấu hình file `.env` khi chạy Production:**
```env
NODE_ENV="production"
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/goclangnghe"
SESSION_SECRET="chuoi-bi-mat-ngau-nhien-it-nhat-32-ky-tu"
GEMINI_API_KEY="khoa-api-gemini-lay-tu-aistudio"
```

**Lệnh khởi chạy Production:**
```bash
# 1. Build frontend
npm run build

# 2. Khởi chạy server production
npm start
```

---

## 3. BẢNG PHÂN ĐỊNH TRẠNG THÁI TRIỂN KHAI

| Thành phần / Tính năng | Trạng thái trong AI Studio | Thao tác Quản trị viên cần làm trên Tài khoản Thật |
| :--- | :--- | :--- |
| **Cơ sở dữ liệu Cloud SQL (PostgreSQL)** | ✅ **Đã tạo & kiểm thử thành công** (`ai-studio-97a78bf3` tại region `asia-southeast1` với 9 bảng quan hệ). | Khi chạy độc lập trên tài khoản GCP riêng: Thiết lập IAM Service Account & Cloud SQL Auth Proxy hoặc chạy container PostgreSQL 16. |
| **Mã nguồn Backend & REST API** | ✅ **Đã hoàn thiện & chạy chuẩn xác** trên port 3000 với đầy đủ nghiệp vụ CRUD và Audit Log. | Cấu hình biến môi trường production (`NODE_ENV=production`, `PORT=3000`, `SESSION_SECRET`). |
| **Xác thực Firebase Auth & OAuth** | ✅ **Đã cấu hình** `firebase-applet-config.json` và xác thực token hai chiều. | Đưa Google OAuth Consent Screen sang trạng thái Production trong Google Cloud Console và thêm tên miền chính thức của trường. |
| **Trợ lý Gemini AI (Bạn Đồng Hành)** | ✅ **Đã tích hợp server-side**, có bộ lọc an toàn, nhận diện khẩn cấp và chuyển giao hồ sơ. | Cấp khóa `GEMINI_API_KEY` từ Google AI Studio Console vào Secret Manager của máy chủ sản xuất. |
| **Kiểm thử tự động & Bảo mật** | ✅ **Đạt 100%** cả 9 bài kiểm thử hệ thống và 10 bài kiểm thử bảo mật (`npm test`, `npm run test:security`). | Định kỳ chạy kiểm thử hồi quy (regression testing) khi nâng cấp phiên bản. |
| **Tên miền & HTTPS (SSL/TLS)** | 🔄 Môi trường thử nghiệm dùng domain `.run.app` có sẵn SSL của Google. | **Cần thực hiện:** Đăng ký tên miền trường học (ví dụ: `goclangnghe.truonghoc.edu.vn`), trỏ DNS và sinh chứng chỉ SSL Let's Encrypt qua Certbot. |
| **Sao lưu tự động (Backup)** | 🔄 Đã tạo sẵn script `scripts/backup.sh` với cơ chế xoay vòng 30 ngày. | **Cần thực hiện:** Thêm lệnh vào crontab máy chủ hoặc bật Automated Daily Backups trên Cloud SQL Console. |
| **Giám sát & Cảnh báo (Monitoring)** | ✅ Đã có sẵn endpoint `/api/health` và bảng thống kê `/api/stats`. | **Cần thực hiện:** Kết nối Cloud Monitoring, Uptime Robot hoặc Prometheus để nhận thông báo Telegram/Email khi server gián đoạn. |

---

## 3. CẤU HÌNH BIẾN MÔI TRƯỜNG

Tạo file `.env` trên máy chủ từ mẫu `.env.example`:

```bash
cp .env.example .env
```

Nội dung cấu hình chuẩn:

```env
# API Key của Gemini AI (Lấy tại aistudio.google.com)
GEMINI_API_KEY="AIzaSyYourSecretGeminiApiKeyHere"

# Tên miền chính thức của trường
APP_URL="https://goclangnghe.truonghoc.edu.vn"

# Cổng lắng nghe
PORT=3000
NODE_ENV="production"

# Chuỗi bí mật ký Session Token (Tối thiểu 32 ký tự ngẫu nhiên)
SESSION_SECRET="4f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a"

# Cấu hình Cơ sở dữ liệu PostgreSQL
SQL_HOST="127.0.0.1"
SQL_DB_NAME="school_counseling"
SQL_USER="app_user"
SQL_PASSWORD="MatKhauNguoiDungApp2026!"
SQL_ADMIN_USER="postgres"
SQL_ADMIN_PASSWORD="MatKhauAdminPostgres2026!"
```

---

## 4. HƯỚNG DẪN CÀI ĐẶT & MIGRATION DATABASE

### Bước 4.1: Cài đặt Dependencies
```bash
npm install
```

### Bước 4.2: Khởi tạo Database PostgreSQL
Nếu bạn tự dựng cơ sở dữ liệu PostgreSQL trên máy chủ mới:

```bash
# Đăng nhập PostgreSQL
sudo -u postgres psql

# Tạo cơ sở dữ liệu và tài khoản ứng dụng
CREATE DATABASE school_counseling;
CREATE USER app_user WITH PASSWORD 'MatKhauNguoiDungApp2026!';
GRANT ALL PRIVILEGES ON DATABASE school_counseling TO app_user;
\q
```

### Bước 4.3: Chạy Migration khởi tạo 9 bảng
Cách 1: Sử dụng Drizzle Kit (Khuyên dùng):
```bash
npx drizzle-kit push --config=src/db/drizzle.config.ts
```

Cách 2: Sử dụng file SQL khởi tạo có sẵn:
```bash
psql -h 127.0.0.1 -U postgres -d school_counseling -f prisma/migrations/0_init/migration.sql
```

---

## 5. HƯỚNG DẪN KIỂM THỬ HỆ THỐNG

Chạy bộ kiểm thử tự động để đảm bảo toàn bộ hệ thống hoạt động ổn định trước khi mở cho học sinh:

```bash
# 1. Kiểm thử chức năng cơ sở dữ liệu và AI
npm test

# 2. Kiểm thử bảo mật (IDOR, XSS, Brute-Force lockout, SQLi, Token Tampering)
npm run test:security

# 3. Kiểm thử biên dịch toàn bộ frontend
npm run build

# 4. Kiểm thử cú pháp TypeScript
npm run lint
```

---

## 6. HƯỚNG DẪN TRIỂN KHAI THỰC TẾ

### LỰA CHỌN A: Triển khai qua Docker Compose (Đơn giản nhất cho VPS / Máy chủ trường học)

1. **Chuẩn bị file cấu hình:**
   ```bash
   cp .env.example .env
   # Chỉnh sửa mật khẩu và GEMINI_API_KEY trong file .env
   nano .env
   ```

2. **Khởi động ứng dụng cùng PostgreSQL bằng một lệnh:**
   ```bash
   docker compose up -d --build
   ```

3. **Kiểm tra trạng thái container:**
   ```bash
   docker compose ps
   docker compose logs -f app
   ```

---

### LỰA CHỌN B: Triển khai trên Google Cloud Run & Cloud SQL (Không cần quản lý máy chủ)

1. **Build Container Image lên Google Artifact Registry:**
   ```bash
   gcloud builds submit --tag asia-southeast1-docker.pkg.dev/PROJECT_ID/goclangnghe-repo/goclangnghe:latest
   ```

2. **Triển khai lên Cloud Run kết nối với Cloud SQL:**
   ```bash
   gcloud run deploy goclangnghe \
     --image asia-southeast1-docker.pkg.dev/PROJECT_ID/goclangnghe-repo/goclangnghe:latest \
     --region asia-southeast1 \
     --platform managed \
     --allow-unauthenticated \
     --port 3000 \
     --add-cloudsql-instances PROJECT_ID:asia-southeast1:ai-studio-97a78bf3 \
     --set-env-vars "NODE_ENV=production,SQL_DB_NAME=school_counseling,SQL_USER=postgres" \
     --set-secrets "SQL_PASSWORD=sql-password:latest,GEMINI_API_KEY=gemini-key:latest,SESSION_SECRET=session-secret:latest"
   ```

---

## 7. THIẾT LẬP TÊN MIỀN, NGINX VÀ HTTPS (SSL)

Khi triển khai trên máy chủ riêng (Ubuntu/Debian), hãy dùng Nginx làm Reverse Proxy để bảo vệ cổng Node.js và thiết lập SSL:

1. **Cài đặt Nginx và Certbot:**
   ```bash
   sudo apt update
   sudo apt install -y nginx certbot python3-certbot-nginx
   ```

2. **Áp dụng cấu hình Nginx mẫu:**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/goclangnghe.conf
   sudo ln -s /etc/nginx/sites-available/goclangnghe.conf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **Cấp phát chứng chỉ SSL miễn phí từ Let's Encrypt:**
   ```bash
   sudo certbot --nginx -d goclangnghe.truonghoc.edu.vn
   ```
   *Certbot sẽ tự động thiết lập gia hạn SSL định kỳ.*

---

## 8. QUY TRÌNH SAO LƯU DỰ PHÒNG & KHÔI PHỤC DỮ LIỆU

### 8.1. Lập lịch tự động sao lưu hàng ngày (Cronjob)
Mở bảng lịch trình crontab của máy chủ:
```bash
sudo crontab -e
```
Thêm dòng sau để tự động sao lưu vào lúc 2 giờ sáng mỗi ngày:
```text
0 2 * * * /bin/bash /app/scripts/backup.sh >> /var/log/backup_goclangnghe.log 2>&1
```

### 8.2. Khôi phục dữ liệu từ bản sao lưu khi có sự cố
```bash
# Giải nén và nạp dữ liệu trở lại PostgreSQL
gunzip -c /var/backups/goclangnghe/backup_goclangnghe_YYYYMMDD_HHMMSS.sql.gz | \
  PGPASSWORD="YOUR_ADMIN_PASSWORD" psql -h 127.0.0.1 -U postgres -d school_counseling
```

---

## 9. GIÁM SÁT HỆ THỐNG & NHẬT KÝ KIỂM TOÁN

- **Kiểm tra sức khỏe hệ thống (Health Check):**
  - Endpoint: `GET /api/health`
  - Trả về mã HTTP `200` kèm thời gian hoạt động. Dùng endpoint này để tích hợp Uptime Robot, Cloud Monitoring, hoặc Kubernetes Liveness Probe.
- **Bảng thống kê vận hành nội bộ (Dành cho Giáo viên & Chuyên viên):**
  - Endpoint: `GET /api/stats` (Yêu cầu tài khoản quyền `TEACHER`, `COUNSELOR`, `ADMIN`).
- **Nhật ký kiểm toán an ninh (Audit Logs):**
  - Mọi thao tác nộp phiếu, đăng nhập, đổi trạng thái phiếu, đọc ghi chú nghiệp vụ đều được ghi nhận vào bảng `audit_logs` để phục vụ công tác thanh tra học đường.

---

## 10. HỖ TRỢ VÀ ĐƯỜNG DÂY NÓNG HỌC ĐƯỜNG

- **Tổng đài Quốc gia Bảo vệ Trẻ em:** Gọi **111** (Miễn phí 24/7).
- **Cấp cứu Y tế:** Gọi **115**.
- **Phòng Tư vấn Tâm lý Học đường của Trường:** Phòng 204 (Tầng 2).
  - ThS. Nguyễn Tuấn Anh (Phụ trách tư vấn THCS).
  - Cô Nguyễn Thị Thùy Trang (Phụ trách tư vấn Tiểu học).
