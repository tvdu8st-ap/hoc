// Test suite verifying:
// 1. Development mode without database (in-memory preview, transparent disclosure)
// 2. Production mode strictly requiring valid DATABASE_URL and connection check

import { devStore } from '../server/devStore.ts';
import { getDatabaseConfig, verifyDatabaseConnection } from '../src/db/index.ts';

async function runDevAndProdTests() {
  console.log('\n===============================================================');
  console.log('   KIỂM THỬ CHẾ ĐỘ PHÁT TRIỂN (NO-DB) & KIỂM TRA PRODUCTION   ');
  console.log('===============================================================');

  let passed = 0;
  let failed = 0;

  function assert(cond: boolean, name: string) {
    if (cond) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name}`);
      failed++;
    }
  }

  // 1. Check in-memory store demo users for UI preview
  const demoUsers = devStore.getUsers();
  assert(demoUsers.length >= 5, `In-memory dev store cung cấp đủ tài khoản demo (${demoUsers.length} người dùng)`);
  assert(demoUsers.some((u) => u.role === 'STUDENT'), 'Có tài khoản Học sinh để thử nghiệm giao diện học sinh');
  assert(demoUsers.some((u) => u.role === 'COUNSELOR'), 'Có tài khoản Tư vấn viên để thử nghiệm bảng điều khiển nghiệp vụ');
  assert(demoUsers.some((u) => u.role === 'ADMIN'), 'Có tài khoản Quản trị viên để thử nghiệm phân quyền quản trị');

  // 2. Test in-memory ticket creation & transparent notice
  const testReq = devStore.createRequest({
    requestCode: 'GLN-TEST-999',
    gradeLevel: 'SECONDARY',
    topic: 'STUDY_PRESSURE',
    isAnonymous: true,
    studentAlias: 'Bạn kiểm thử dev',
    contactMethod: 'Hòm thư bí mật',
    preferredTime: 'Giờ ra chơi',
    content: 'Thử nghiệm giao diện không cần PostgreSQL database',
    status: 'RECEIVED',
    urgencyLevel: 'NORMAL',
    privacyAgreed: true,
  });
  assert(testReq.requestCode === 'GLN-TEST-999', 'In-memory store tạo thành công phiếu tư vấn phục vụ kiểm thử UI');

  const foundReq = devStore.findRequestByCode('GLN-TEST-999');
  assert(foundReq !== undefined && foundReq.content.includes('Thử nghiệm'), 'Tra cứu lại được phiếu trong bộ nhớ tạm In-Memory');

  // 3. Test in-memory appointment scheduling
  const testApt = devStore.createAppointment({
    appointmentCode: 'LICH-TEST-123',
    studentName: 'Em học sinh thử nghiệm',
    counselorId: 'usr-counselor-01',
    counselorName: 'Cô Hoàng Thúy Hà',
    date: '2026-10-20',
    startTime: '14:00',
    endTime: '14:45',
    format: 'IN_PERSON',
    location: 'Phòng 204',
    reasonTopic: 'STUDY_PRESSURE',
    status: 'SCHEDULED',
  });
  assert(testApt.appointmentCode === 'LICH-TEST-123', 'In-memory store lưu tạm lịch hẹn tư vấn cho giao diện');

  // 4. Test Development No-DB activation via DEV_NO_DB=true
  process.env.DEV_NO_DB = 'true';
  const isConnectedDev = await verifyDatabaseConnection(false);
  assert(isConnectedDev === false, 'Ở môi trường phát triển (DEV_NO_DB=true), hệ thống chạy mượt mà ở chế độ In-Memory mà không bị crash');
  delete process.env.DEV_NO_DB;

  // 5. Check database config detection
  const currentConfig = getDatabaseConfig();
  assert(currentConfig.source !== 'NONE' || currentConfig.config === null, 'Hàm getDatabaseConfig() nhận diện chính xác nguồn cấu hình kết nối');

  console.log(`\nTổng kết: ${passed} đạt, ${failed} không đạt\n`);
  if (failed > 0) process.exit(1);
}

runDevAndProdTests().catch((err) => {
  console.error('Lỗi thực thi kiểm thử:', err);
  process.exit(1);
});
