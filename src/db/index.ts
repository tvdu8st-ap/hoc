import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import type { PoolConfig } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export interface DbStatusInfo {
  isConfigured: boolean;
  isConnected: boolean;
  mode: 'postgres' | 'in-memory-dev';
  connectionSource: 'DATABASE_URL' | 'SQL_HOST' | 'NONE';
  errorMessage?: string;
}

let _isDbConnected = false;
let _connectionError: string | undefined = undefined;

/**
 * Lấy cấu hình kết nối PostgreSQL từ biến môi trường.
 * Ưu tiên:
 * 1. DATABASE_URL (chuỗi kết nối chuẩn: postgresql://user:pass@host:5432/dbname)
 * 2. Biến SQL_* phân tách (SQL_HOST, SQL_USER, SQL_PASSWORD, SQL_DB_NAME)
 */
export function getDatabaseConfig(): { config: PoolConfig | null; source: 'DATABASE_URL' | 'SQL_HOST' | 'NONE' } {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
    return {
      config: {
        connectionString: process.env.DATABASE_URL.trim(),
        max: 10,
        connectionTimeoutMillis: 5000,
      },
      source: 'DATABASE_URL',
    };
  }

  if (process.env.SQL_HOST && process.env.SQL_USER) {
    return {
      config: {
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DB_NAME,
        max: 10,
        connectionTimeoutMillis: 5000,
      },
      source: 'SQL_HOST',
    };
  }

  return { config: null, source: 'NONE' };
}

export const createPool = (): Pool => {
  if (!global._postgresPool) {
    const { config } = getDatabaseConfig();
    // Khởi tạo Pool với cấu hình hoặc fallback an toàn không làm crash quá trình import
    global._postgresPool = new Pool(
      config || {
        host: '127.0.0.1',
        port: 5432,
        connectionTimeoutMillis: 2000,
      }
    );

    global._postgresPool.on('error', (err) => {
      // Bắt lỗi ngầm từ client idle, không để tiến trình dừng đột ngột
      if (_isDbConnected) {
        console.error('[POSTGRESQL POOL WARNING]', err.message);
      }
    });
  }
  return global._postgresPool;
};

const pool = createPool();
export const db = drizzle(pool, { schema });
export { pool };

export function isDatabaseConnected(): boolean {
  return _isDbConnected;
}

export function getDbStatus(): DbStatusInfo {
  const { source } = getDatabaseConfig();
  return {
    isConfigured: source !== 'NONE',
    isConnected: _isDbConnected,
    mode: _isDbConnected ? 'postgres' : 'in-memory-dev',
    connectionSource: source,
    errorMessage: _connectionError,
  };
}

/**
 * Kiểm tra kết nối cơ sở dữ liệu khi khởi động server:
 * - Khi NODE_ENV === 'production': BẮT BUỘC có DATABASE_URL hợp lệ và kết nối thành công. Nếu không, báo lỗi rõ ràng và dừng server.
 * - Khi NODE_ENV !== 'production': Nếu chưa có database, tự động kích hoạt chế độ xem trước In-Memory để kiểm thử giao diện.
 */
export async function verifyDatabaseConnection(isProduction: boolean): Promise<boolean> {
  const { config, source } = getDatabaseConfig();

  // Cho phép cố tình ép chế độ dev no-db qua biến DEV_NO_DB
  if (!isProduction && process.env.DEV_NO_DB === 'true') {
    _isDbConnected = false;
    console.log('\n================================================================================');
    console.log('📌 [GÓC LẮNG NGHE - CHẾ ĐỘ XEM TRƯỚC GIAO DIỆN]');
    console.log('Biến môi trường DEV_NO_DB=true được kích hoạt.');
    console.log('-> Kích hoạt CHẾ ĐỘ PHÁT TRIỂN KHÔNG DATABASE (In-Memory Development Mode).');
    console.log('-> Toàn bộ giao diện và các vai trò (học sinh, tư vấn, quản trị) sẵn sàng kiểm thử.');
    console.log('-> [CẢNH BÁO MINH BẠCH]: Dữ liệu KHÔNG được lưu vào cơ sở dữ liệu thực tế.');
    console.log('================================================================================\n');
    return false;
  }

  // Trường hợp CHƯA CẤU HÌNH biến kết nối
  if (!config) {
    if (isProduction) {
      console.error('\n' + '█'.repeat(80));
      console.error(' [LỖI KHỞI ĐỘNG PRODUCTION - THIẾU CẤU HÌNH DATABASE_URL]');
      console.error('█'.repeat(80));
      console.error(' Hệ thống đang chạy trong môi trường PRODUCTION (NODE_ENV=production)');
      console.error(' nhưng biến môi trường DATABASE_URL chưa được thiết lập!');
      console.error('');
      console.error(' YÊU CẦU BẢO MẬT & TOÀN VẸN DỮ LIỆU:');
      console.error(' - Trong môi trường thực tế, hệ thống KHÔNG cho phép chạy ở chế độ giả lập in-memory');
      console.error('   để tránh mất mát hồ sơ tư vấn tâm lý và dữ liệu học sinh.');
      console.error('');
      console.error(' HƯỚNG DẪN THIẾT LẬP:');
      console.error(' 1. Khởi tạo một cơ sở dữ liệu PostgreSQL (PostgreSQL 15+ hoặc Cloud SQL, Supabase, Neon).');
      console.error(' 2. Cung cấp biến môi trường DATABASE_URL trong file .env hoặc cấu hình server:');
      console.error('    DATABASE_URL="postgresql://username:password@localhost:5432/goclangnghe"');
      console.error(' 3. Chạy migration tạo bảng: npm run test hoặc npx drizzle-kit push');
      console.error(' 4. Khởi động lại ứng dụng: npm start');
      console.error('█'.repeat(80) + '\n');
      process.exit(1);
    } else {
      _isDbConnected = false;
      console.log('\n================================================================================');
      console.log('📌 [GÓC LẮNG NGHE - CHẾ ĐỘ PHÁT TRIỂN / XEM TRƯỚC GIAO DIỆN]');
      console.log('Chưa phát hiện cấu hình PostgreSQL (chưa thiết lập DATABASE_URL).');
      console.log('-> Tự động kích hoạt CHẾ ĐỘ XEM TRƯỚC KHÔNG DATABASE (In-Memory Mode).');
      console.log('-> Bạn có thể xem, tương tác và kiểm thử toàn bộ giao diện đầy đủ.');
      console.log('-> [CẢNH BÁO MINH BẠCH]: Dữ liệu thử nghiệm chỉ lưu tạm trong RAM, KHÔNG lưu vào database thực.');
      console.log('================================================================================\n');
      return false;
    }
  }

  // Trường hợp ĐÃ CÓ CẤU HÌNH: Kiểm tra kết nối thực tế
  try {
    const client = await pool.connect();
    await client.query('SELECT 1 as health_check;');
    client.release();
    _isDbConnected = true;
    _connectionError = undefined;
    console.log(`[Góc Lắng Nghe] Đã kết nối thành công tới cơ sở dữ liệu PostgreSQL (nguồn: ${source}).`);
    return true;
  } catch (err: any) {
    _connectionError = err.message;
    if (isProduction) {
      console.error('\n' + '█'.repeat(80));
      console.error(' [LỖI KẾT NỐI POSTGRESQL PRODUCTION - DATABASE_URL]');
      console.error('█'.repeat(80));
      console.error(' Hệ thống đã nhận cấu hình kết nối nhưng không thể kết nối tới cơ sở dữ liệu!');
      console.error(` Nguồn cấu hình: ${source}`);
      console.error(` Chi tiết lỗi từ máy chủ PostgreSQL: ${err.message}`);
      console.error('');
      console.error(' VUI LÒNG KIỂM TRA:');
      console.error(' 1. Máy chủ PostgreSQL có đang hoạt động và lắng nghe cổng kết nối không?');
      console.error(' 2. Tên đăng nhập, mật khẩu và tên database trong DATABASE_URL có chính xác không?');
      console.error(' 3. Tường lửa hoặc mạng có cho phép máy chủ Node.js kết nối tới PostgreSQL không?');
      console.error(' Hệ thống buộc phải dừng khởi động để bảo vệ an toàn.');
      console.error('█'.repeat(80) + '\n');
      process.exit(1);
    } else {
      _isDbConnected = false;
      console.log('\n================================================================================');
      console.log('📌 [GÓC LẮNG NGHE - CHẾ ĐỘ PHÁT TRIỂN / XEM TRƯỚC GIAO DIỆN]');
      console.log(`Không thể kết nối tới PostgreSQL cục bộ: ${err.message}`);
      console.log('-> Tự động chuyển sang CHẾ ĐỘ XEM TRƯỚC KHÔNG DATABASE (In-Memory Mode).');
      console.log('-> Giao diện và các màn hình xem trước vẫn hoạt động bình thường.');
      console.log('-> [CẢNH BÁO MINH BẠCH]: Dữ liệu KHÔNG được lưu vào cơ sở dữ liệu thực tế.');
      console.log('================================================================================\n');
      return false;
    }
  }
}
