#!/bin/bash
# ==============================================================================
# Script thực thi migration và kiểm tra cơ sở dữ liệu
# Sử dụng Drizzle Kit hoặc psql nạp trực tiếp file SQL init
# ==============================================================================

set -e

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "=========================================================="
echo "  KHỞI TẠO & MIGRATION CƠ SỞ DỮ LIỆU GÓC LẮNG NGHE"
echo "=========================================================="

echo "1. Đang kiểm tra kết nối tới cơ sở dữ liệu PostgreSQL..."
PGPASSWORD="${SQL_ADMIN_PASSWORD}" psql \
  -h "${SQL_HOST:-127.0.0.1}" \
  -U "${SQL_ADMIN_USER:-postgres}" \
  -d "${SQL_DB_NAME:-school_counseling}" \
  -c "SELECT 1;" > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "=> Kết nối thành công!"
else
  echo "=> Lỗi: Không thể kết nối tới PostgreSQL với thông tin cung cấp."
  exit 1
fi

echo "2. Thực thi Drizzle Kit Push / Migration..."
npx drizzle-kit push --config=src/db/drizzle.config.ts

echo "3. Kiểm tra danh sách bảng đã khởi tạo..."
PGPASSWORD="${SQL_ADMIN_PASSWORD}" psql \
  -h "${SQL_HOST:-127.0.0.1}" \
  -U "${SQL_ADMIN_USER:-postgres}" \
  -d "${SQL_DB_NAME:-school_counseling}" \
  -c "\dt"

echo "=========================================================="
echo "  MIGRATION HOÀN TẤT THÀNH CÔNG!"
echo "=========================================================="
