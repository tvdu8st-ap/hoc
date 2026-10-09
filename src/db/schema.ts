import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Users Table (Integrated with Firebase Auth UID & Role-Based Access Control)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID or system account ID
  email: text('email'),
  fullName: text('full_name').notNull(),
  role: text('role').notNull().default('STUDENT'), // STUDENT | PARENT | TEACHER | COUNSELOR | ADMIN
  gradeLevel: text('grade_level').default('SECONDARY'), // PRIMARY | SECONDARY | GENERAL
  phoneNumber: text('phone_number'),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Counseling Requests (Góc Chia Sẻ Tickets)
export const counselingRequests = pgTable('counseling_requests', {
  id: serial('id').primaryKey(),
  requestCode: text('request_code').notNull().unique(), // E.g. GLN-739218
  gradeLevel: text('grade_level').notNull().default('SECONDARY'),
  topic: text('topic').notNull(),
  isAnonymous: boolean('is_anonymous').notNull().default(true),
  studentAlias: text('student_alias'),
  studentClass: text('student_class'),
  contactMethod: text('contact_method').notNull(),
  contactValue: text('contact_value'),
  preferredTime: text('preferred_time'),
  content: text('content').notNull(),
  status: text('status').notNull().default('RECEIVED'), // RECEIVED | CLASSIFYING | ASSIGNED | IN_PROGRESS | WAITING_FEEDBACK | RESOLVED | CLOSED
  urgencyLevel: text('urgency_level').notNull().default('NORMAL'),
  privacyAgreed: boolean('privacy_agreed').notNull().default(true),
  assignedCounselorId: text('assigned_counselor_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 3. Two-Way Request Messages Thread (Trao đổi an toàn 2 chiều)
export const requestMessages = pgTable('request_messages', {
  id: serial('id').primaryKey(),
  requestId: integer('request_id').references(() => counselingRequests.id, { onDelete: 'cascade' }),
  requestCode: text('request_code').notNull(),
  senderType: text('sender_type').notNull(), // STUDENT | COUNSELOR
  senderName: text('sender_name').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Counselor Clinical Notes (Ghi chú nghiệp vụ cách ly bảo mật)
export const counselingNotes = pgTable('counseling_notes', {
  id: serial('id').primaryKey(),
  requestId: integer('request_id').references(() => counselingRequests.id, { onDelete: 'cascade' }),
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  isPrivate: boolean('is_private').notNull().default(true),
  actionTaken: text('action_taken'),
  noteContent: text('note_content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. Counseling Appointments (Đặt Lịch & Chống Trùng Lịch)
export const counselingAppointments = pgTable('counseling_appointments', {
  id: serial('id').primaryKey(),
  appointmentCode: text('appointment_code').notNull().unique(), // E.g. LICH-26101
  counselorId: text('counselor_id').notNull(),
  counselorName: text('counselor_name').notNull(),
  studentName: text('student_name').notNull(),
  studentContact: text('student_contact'),
  date: text('date').notNull(), // YYYY-MM-DD
  startTime: text('start_time').notNull(), // HH:mm
  endTime: text('end_time').notNull(), // HH:mm
  format: text('format').notNull().default('IN_PERSON'), // IN_PERSON | PRIVATE_ONLINE | PHONE_SAFE
  location: text('location').notNull().default('Phòng Tư vấn Tâm lý Học đường (P.204)'),
  status: text('status').notNull().default('SCHEDULED'), // SCHEDULED | CONFIRMED | COMPLETED | RESCHEDULED | CANCELLED
  reasonTopic: text('reason_topic').notNull(),
  privateNotes: text('private_notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 6. Educational Resources (Thư Viện Kỹ Năng Sống)
export const educationalResources = pgTable('educational_resources', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  summary: text('summary').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  gradeLevel: text('grade_level').notNull().default('GENERAL'),
  readTimeMinutes: integer('read_time_minutes').notNull().default(3),
  isPublished: boolean('is_published').notNull().default(true),
  authorName: text('author_name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 7. Bullying Reports (Phòng Chống Bắt Nạt Học Đường)
export const bullyingReports = pgTable('bullying_reports', {
  id: serial('id').primaryKey(),
  reportCode: text('report_code').notNull().unique(), // E.g. BCBN-9021
  gradeLevel: text('grade_level').notNull().default('SECONDARY'),
  victimType: text('victim_type').notNull(),
  incidentType: text('incident_type').notNull(),
  location: text('location'),
  incidentDate: text('incident_date'),
  description: text('description').notNull(),
  safeContact: text('safe_contact'),
  isAnonymous: boolean('is_anonymous').notNull().default(true),
  status: text('status').notNull().default('URGENT_REVIEW'), // URGENT_REVIEW | INVESTIGATING | SUPPORTING | RESOLVED
  actionPlan: text('action_plan'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 8. Emotion Check-ins (Nhận Diện Cảm Xúc)
export const emotionCheckins = pgTable('emotion_checkins', {
  id: serial('id').primaryKey(),
  moodKey: text('mood_key').notNull(),
  moodLabel: text('mood_label').notNull(),
  energyScore: integer('energy_score').default(3),
  note: text('note'),
  gradeLevel: text('grade_level').notNull().default('GENERAL'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 9. Audit Logs (Nhật Ký Kiểm Toán Bảo Mật)
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  actionType: text('action_type').notNull(),
  targetResource: text('target_resource').notNull(),
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const counselingRequestsRelations = relations(counselingRequests, ({ many }) => ({
  messages: many(requestMessages),
  notes: many(counselingNotes),
}));

export const requestMessagesRelations = relations(requestMessages, ({ one }) => ({
  request: one(counselingRequests, {
    fields: [requestMessages.requestId],
    references: [counselingRequests.id],
  }),
}));

export const counselingNotesRelations = relations(counselingNotes, ({ one }) => ({
  request: one(counselingRequests, {
    fields: [counselingNotes.requestId],
    references: [counselingRequests.id],
  }),
}));
