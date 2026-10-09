import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes/api.js';
import { applySecurityHeaders } from './server/middleware.ts';
import { verifyDatabaseConnection } from './src/db/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const PORT = Number(process.env.PORT) || 3000;

  // Kiểm tra kết nối cơ sở dữ liệu:
  // - Nếu là Production: Bắt buộc DATABASE_URL hợp lệ, nếu không báo lỗi chi tiết và thoát.
  // - Nếu là Development: Nếu chưa cấu hình PostgreSQL, tự động kích hoạt chế độ In-Memory để kiểm thử giao diện.
  await verifyDatabaseConnection(isProd);

  const app = express();

  // Security hardening: hide server framework & apply secure headers
  app.disable('x-powered-by');
  app.use(applySecurityHeaders);

  // Prevent memory exhaustion via oversized payloads
  app.use(express.json({ limit: '256kb' }));
  app.use(express.urlencoded({ extended: true, limit: '256kb' }));

  // API router
  app.use('/api', apiRouter);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      appName: 'Góc Lắng Nghe - Cùng Em Trưởng Thành',
    });
  });

  if (!isProd) {
    // Mount Vite middleware in development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Góc Lắng Nghe] Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
