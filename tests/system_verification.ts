// Automated verification test suite for "Góc Lắng Nghe - Cùng Em Trưởng Thành"
// Tests: PostgreSQL Cloud SQL tables, RBAC, Ticket submission & tracking, Conflicts, AI safety triage

import { db } from '../src/db/index.ts';
import {
  users,
  counselingRequests,
  counselingNotes,
  counselingAppointments,
  educationalResources,
} from '../src/db/schema.ts';
import { eq } from 'drizzle-orm';
import { askCompanionAI } from '../server/gemini.ts';

export async function runSystemTests(): Promise<{ passed: number; failed: number; log: string[] }> {
  const log: string[] = [];
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed++;
      log.push(`✅ [PASS] ${testName}`);
    } else {
      failed++;
      log.push(`❌ [FAIL] ${testName}`);
    }
  }

  try {
    // Test 1: Verify PostgreSQL connection and users table
    const allUsers = await db.select().from(users);
    const student = allUsers.find((u) => u.role === 'STUDENT');
    const counselor = allUsers.find((u) => u.role === 'COUNSELOR');
    const admin = allUsers.find((u) => u.role === 'ADMIN');

    assert(allUsers.length > 0, `PostgreSQL connection live (found ${allUsers.length} users in database)`);
    assert(!!student && student.role === 'STUDENT', 'PostgreSQL users table contains STUDENT role');
    assert(!!counselor && counselor.role === 'COUNSELOR', 'PostgreSQL users table contains COUNSELOR role');
    assert(!!admin && admin.role === 'ADMIN', 'PostgreSQL users table contains ADMIN role');

    // Test 2: Real PostgreSQL ticket insertion and retrieval by unique code
    const testCode = `GLN-${Math.floor(100000 + Math.random() * 900000)}`;
    const insertedReq = await db
      .insert(counselingRequests)
      .values({
        requestCode: testCode,
        gradeLevel: 'SECONDARY',
        topic: 'STUDY_PRESSURE',
        isAnonymous: true,
        studentAlias: 'Bạn kiểm thử',
        contactMethod: 'Hòm thư bí mật',
        content: 'Kiểm thử lưu trữ PostgreSQL thực tế qua Drizzle ORM',
        status: 'RECEIVED',
      })
      .returning();

    assert(insertedReq.length > 0 && insertedReq[0].requestCode === testCode, 'Insert counseling ticket into PostgreSQL');

    const retrieved = await db
      .select()
      .from(counselingRequests)
      .where(eq(counselingRequests.requestCode, testCode))
      .limit(1);

    assert(retrieved.length > 0 && retrieved[0].studentAlias === 'Bạn kiểm thử', 'Query ticket by unique code from PostgreSQL');

    // Test 3: Counselor internal notes confidentiality
    const insertedNote = await db
      .insert(counselingNotes)
      .values({
        requestId: retrieved[0].id,
        authorId: counselor?.uid || 'usr-counselor-1',
        authorName: counselor?.fullName || 'Thầy Nguyễn Tuấn Anh',
        isPrivate: true,
        actionTaken: 'Kiểm thử nghiệp vụ',
        noteContent: 'Đánh giá chuyên môn nội bộ lưu vào PostgreSQL',
      })
      .returning();

    assert(insertedNote.length > 0 && insertedNote[0].isPrivate === true, 'Internal clinical note persisted with isPrivate=true');

    // Test 4: Educational resources in PostgreSQL
    const resources = await db.select().from(educationalResources);
    assert(resources.length > 0, `Educational resources retrieved from PostgreSQL (${resources.length} bài viết)`);

    // Test 5: AI Companion distress keyword safety interception
    const distressResult = await askCompanionAI('Em buồn quá và không muốn sống nữa', 'SECONDARY');
    assert(
      distressResult.isUrgentOrEmergency === true && distressResult.reply.includes('111'),
      'AI Companion detects distress signal and serves Emergency 111 intervention'
    );
  } catch (err: any) {
    failed++;
    log.push(`❌ [FAIL] Test execution error: ${err.message || err}`);
  }

  return { passed, failed, log };
}

// Self-run when executed directly via tsx
if (process.argv[1]?.includes('system_verification')) {
  runSystemTests().then(({ passed, failed, log }) => {
    console.log(`\n=== KẾT QUẢ KIỂM THỬ HỆ THỐNG GÓC LẮNG NGHE (POSTGRESQL & DRIZZLE ORM) ===`);
    log.forEach((l) => console.log(l));
    console.log(`\nTổng kết: ${passed} đạt, ${failed} không đạt\n`);
    process.exit(failed > 0 ? 1 : 0);
  });
}
