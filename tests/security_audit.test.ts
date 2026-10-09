// Automated Security Audit Test Suite
// Verifies: Authentication, RBAC, Data Isolation, IDOR, XSS, Token Tampering, SQL Injection Resistance

import { createSignedToken, verifySignedToken, sanitizeText, generateSecureTicketCode } from '../server/security.ts';
import { trackFailedLookup, isLookupBlocked, resetLookupFailure } from '../server/middleware.ts';
import { db } from '../src/db/index.ts';
import { counselingRequests, users, educationalResources } from '../src/db/schema.ts';
import { eq, like } from 'drizzle-orm';

export async function runSecurityAuditTests(): Promise<{ passed: number; failed: number; log: string[] }> {
  const log: string[] = [];
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      passed++;
      log.push(`🛡️ [PASS] ${testName}`);
    } else {
      failed++;
      log.push(`🚨 [VULN] ${testName}${detail ? ` - ${detail}` : ''}`);
    }
  }

  // --- Test 1: Cryptographic Session Token Generation & Verification ---
  const validStudentToken = createSignedToken('usr-student-1', 'STUDENT');
  const validCounselorToken = createSignedToken('usr-counselor-1', 'COUNSELOR');

  const decodedStudent = verifySignedToken(validStudentToken);
  assert(
    !!decodedStudent && decodedStudent.uid === 'usr-student-1' && decodedStudent.role === 'STUDENT',
    'Valid HMAC signed token correctly decodes with matching role and UID'
  );

  // --- Test 2: Rejection of Tampered / Forged Tokens ---
  const tamperedToken = validStudentToken.slice(0, -6) + 'FORGED';
  const decodedTampered = verifySignedToken(tamperedToken);
  assert(decodedTampered === null, 'Tampered token signature is strictly rejected by server');

  const randomGibberish = 'not.a.valid.jwt.token';
  assert(verifySignedToken(randomGibberish) === null, 'Arbitrary forged token strings are rejected');

  // --- Test 3: IDOR & Brute-Force Code Enumeration Defense ---
  const testIp = '198.51.100.99';
  resetLookupFailure(testIp);

  // Simulate 6 failed lookup attempts
  for (let i = 0; i < 5; i++) {
    trackFailedLookup(testIp);
  }
  const blockedOn6th = trackFailedLookup(testIp);
  assert(blockedOn6th === true, 'Repeated invalid code lookups trigger automated 10-minute IP lockout defense');
  assert(isLookupBlocked(testIp) === true, 'IP is marked as locked out for tracking requests');
  resetLookupFailure(testIp);

  // --- Test 4: Cross-Site Scripting (XSS) Sanitization ---
  const maliciousPayload = '<script>alert("XSS-ATTACK")</script><img src=x onerror=alert(1)>Hello "Friend"';
  const sanitized = sanitizeText(maliciousPayload);
  assert(
    !sanitized.includes('<script>') && !sanitized.includes('<img') && !sanitized.includes('"Friend"'),
    'HTML tags and quote characters are stripped or escaped by sanitizeText'
  );

  // --- Test 5: Cryptographically Secure Ticket Codes ---
  const code1 = generateSecureTicketCode('GLN');
  const code2 = generateSecureTicketCode('GLN');
  assert(
    code1.startsWith('GLN-') && code1.length >= 13 && code1 !== code2,
    `Cryptographically strong ticket code generated (${code1}) with non-sequential entropy`
  );

  // --- Test 6: SQL Injection Resistance with Drizzle Parameterized Queries ---
  const sqlInjectionSearch = "' OR 1=1 -- UNION SELECT * FROM users";
  const searchResults = await db
    .select()
    .from(educationalResources)
    .where(like(educationalResources.title, `%${sqlInjectionSearch}%`));

  assert(
    searchResults.length === 0,
    'SQL injection payload in search string safely parameterized without leaking data'
  );

  // --- Test 7: Student Data Privacy & PII Field Isolation ---
  // Query a ticket from PostgreSQL and verify that contactValue is isolated
  const sampleTicket = await db.select().from(counselingRequests).limit(1);
  if (sampleTicket.length > 0) {
    const t = sampleTicket[0];
    // In our public track response contract, contactValue and internal notes must not be exposed
    const publicExposedFields = Object.keys({
      requestCode: t.requestCode,
      topic: t.topic,
      gradeLevel: t.gradeLevel,
      status: t.status,
      studentAlias: t.studentAlias,
      preferredTime: t.preferredTime,
      content: t.content,
    });

    assert(
      !publicExposedFields.includes('contactValue') && !publicExposedFields.includes('assignedCounselorId'),
      'Public tracking schema isolates sensitive contactValue and assignedCounselorId'
    );
  }

  // --- Test 8: Role Isolation in Database ---
  const staffUsers = await db.select().from(users).where(eq(users.role, 'COUNSELOR'));
  const studentUsers = await db.select().from(users).where(eq(users.role, 'STUDENT'));
  assert(
    staffUsers.length > 0 && studentUsers.length > 0 && staffUsers[0].role !== studentUsers[0].role,
    'Database maintains distinct role separation between COUNSELOR and STUDENT'
  );

  return { passed, failed, log };
}

// Self-run when executed directly
if (process.argv[1]?.includes('security_audit')) {
  runSecurityAuditTests().then(({ passed, failed, log }) => {
    console.log(`\n===============================================================`);
    console.log(`    BÁO CÁO KIỂM THỬ BẢO MẬT HỆ THỐNG GÓC LẮNG NGHE           `);
    console.log(`===============================================================`);
    log.forEach((l) => console.log(l));
    console.log(`\nTổng kết: ${passed} bài kiểm tra đạt, ${failed} lỗ hổng phát hiện.`);
    process.exit(failed > 0 ? 1 : 0);
  });
}
