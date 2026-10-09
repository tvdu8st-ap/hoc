#!/bin/bash
# ==============================================================================
# Script tự động sao lưu định kỳ cơ sở dữ liệu PostgreSQL cho "Góc Lắng Nghe"
# Lưu vào cron: 0 2 * * * /app/scripts/backup.sh (Chạy lúc 2 giờ sáng hàng ngày)
# ==============================================================================

set -e

# Đọc cấu hình từ .env nếu có
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

BACKUP_DIR="${BACKUP_DIR:-/var/backups/goclangnghe}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="backup_goclangnghe_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=30

mkdir -p "${BACKUP_DIR}"

echo "[$(date)] Bắt đầu quá trình sao lưu cơ sở dữ liệu ${SQL_DB_NAME}..."

# Thực hiện pg_dump và nén gzip
PGPASSWORD="${SQL_ADMIN_PASSWORD}" pg_dump \
  -h "${SQL_HOST:-127.0.0.1}" \
  -U "${SQL_ADMIN_USER:-postgres}" \
  -d "${SQL_DB_NAME:-school_counseling}" \
  --clean --if-exists --no-owner --no-privileges \
  | gzip > "${BACKUP_DIR}/${FILENAME}"

echo "[$(date)] Sao lưu thành công: ${BACKUP_DIR}/${FILENAME} (Kích thước: $(du -h "${BACKUP_DIR}/${FILENAME}" | cut -f1))"

# Xóa các bản sao lưu cũ hơn RETENTION_DAYS ngày
echo "[$(date)] Dọn dẹp các bản sao lưu cũ hơn ${RETENTION_DAYS} ngày..."
find "${BACKUP_DIR}" -name "backup_goclangnghe_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -exec rm -f {} \;

echo "[$(date)] Hoàn tất chu trình sao lưu."
