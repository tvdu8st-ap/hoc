# Multi-stage Dockerfile cho Góc Lắng Nghe - Cùng Em Trưởng Thành
# Production Ready - Node.js 22 LTS Alpine

# --- GIAI ĐOẠN 1: Build Frontend Assets ---
FROM node:22-alpine AS builder

WORKDIR /app

# Sao chép package.json và cài đặt dependencies
COPY package*.json ./
RUN npm ci

# Sao chép toàn bộ mã nguồn và build frontend sang thư mục dist/
COPY . .
RUN npm run build

# --- GIAI ĐOẠN 2: Runtime Container ---
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Tạo non-root user để tăng cường bảo mật
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# Sao chép dependencies và file cần thiết
COPY package*.json ./
RUN npm ci --omit=dev && npm install -g tsx

# Sao chép thư mục dist đã build và mã nguồn backend
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src/db ./src/db
COPY --from=builder /app/src/lib ./src/lib
COPY --from=builder /app/firebase-applet-config.json ./firebase-applet-config.json

# Cấp quyền cho appuser
RUN chown -R appuser:nodejs /app

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["tsx", "server.ts"]
