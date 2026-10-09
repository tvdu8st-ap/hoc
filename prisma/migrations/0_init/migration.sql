-- Initial migration for "Góc Lắng Nghe - Cùng Em Trưởng Thành"
-- PostgreSQL DDL Script

-- Enum Types
CREATE TYPE "RoleType" AS ENUM ('STUDENT', 'PARENT', 'TEACHER', 'COUNSELOR', 'ADMIN');
CREATE TYPE "GradeLevel" AS ENUM ('PRIMARY', 'SECONDARY', 'GENERAL');
CREATE TYPE "RequestTopic" AS ENUM ('STUDY_PRESSURE', 'PEER_FRIENDSHIP', 'FAMILY_RELATION', 'EMOTIONAL_STRESS', 'SCHOOL_BULLYING', 'CYBER_BULLYING', 'COMMUNICATION_SKILL', 'PUBERTY_GROWTH', 'OTHER');
CREATE TYPE "RequestStatus" AS ENUM ('RECEIVED', 'CLASSIFYING', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_FEEDBACK', 'RESOLVED', 'CLOSED');
CREATE TYPE "MeetingFormat" AS ENUM ('IN_PERSON', 'PRIVATE_ONLINE', 'PHONE_SAFE');
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'RESCHEDULED', 'CANCELLED');

-- Users table
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "email" TEXT UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "RoleType" NOT NULL DEFAULT 'STUDENT',
    "gradeLevel" "GradeLevel" DEFAULT 'SECONDARY',
    "phoneNumber" TEXT,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Student Profiles
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
    "schoolClass" TEXT,
    "parentName" TEXT,
    "parentContact" TEXT,
    "emergencyNote" TEXT,
    "hasConsent" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Counseling Requests
CREATE TABLE "CounselingRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestCode" TEXT NOT NULL UNIQUE,
    "gradeLevel" "GradeLevel" NOT NULL,
    "topic" "RequestTopic" NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "studentAlias" TEXT,
    "studentClass" TEXT,
    "contactMethod" TEXT NOT NULL,
    "contactValue" TEXT,
    "preferredTime" TEXT,
    "content" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'RECEIVED',
    "urgencyLevel" TEXT NOT NULL DEFAULT 'NORMAL',
    "privacyAgreed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "idx_request_code" ON "CounselingRequest"("requestCode");
CREATE INDEX "idx_request_status" ON "CounselingRequest"("status");

-- Request Messages (Two-way confidential communication)
CREATE TABLE "RequestMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL REFERENCES "CounselingRequest"("id") ON DELETE CASCADE,
    "senderType" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Counseling Assignments
CREATE TABLE "CounselingAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL REFERENCES "CounselingRequest"("id") ON DELETE CASCADE,
    "counselorId" TEXT NOT NULL REFERENCES "User"("id"),
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignmentRole" TEXT NOT NULL DEFAULT 'PRIMARY'
);

-- Private Counseling Notes (Strict counselor confidentiality)
CREATE TABLE "CounselingNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL REFERENCES "CounselingRequest"("id") ON DELETE CASCADE,
    "authorId" TEXT NOT NULL REFERENCES "User"("id"),
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "actionTaken" TEXT,
    "noteContent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Appointments
CREATE TABLE "CounselingAppointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appointmentCode" TEXT NOT NULL UNIQUE,
    "requestId" TEXT REFERENCES "CounselingRequest"("id") ON DELETE SET NULL,
    "counselorId" TEXT NOT NULL REFERENCES "User"("id"),
    "studentId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
    "studentName" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "format" "MeetingFormat" NOT NULL DEFAULT 'IN_PERSON',
    "location" TEXT NOT NULL DEFAULT 'Phòng Tư vấn Tâm lý Học đường (P.204)',
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "reasonTopic" "RequestTopic" NOT NULL,
    "privateNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "idx_appointment_date" ON "CounselingAppointment"("date", "startTime");

-- Educational Resources
CREATE TABLE "EducationalResource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "gradeLevel" "GradeLevel" NOT NULL DEFAULT 'GENERAL',
    "thumbnailUrl" TEXT,
    "readTimeMinutes" INTEGER NOT NULL DEFAULT 3,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT REFERENCES "User"("id"),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bullying Reports
CREATE TABLE "BullyingReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportCode" TEXT NOT NULL UNIQUE,
    "gradeLevel" "GradeLevel" NOT NULL,
    "victimType" TEXT NOT NULL,
    "incidentType" TEXT NOT NULL,
    "location" TEXT,
    "incidentDate" TEXT,
    "description" TEXT NOT NULL,
    "safeContact" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'URGENT_REVIEW',
    "actionPlan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Emotion Check-in
CREATE TABLE "EmotionCheckin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT,
    "moodKey" TEXT NOT NULL,
    "moodLabel" TEXT NOT NULL,
    "energyScore" INTEGER,
    "note" TEXT,
    "gradeLevel" "GradeLevel" NOT NULL DEFAULT 'GENERAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT REFERENCES "User"("id"),
    "actionType" TEXT NOT NULL,
    "targetResource" TEXT NOT NULL,
    "ipAddress" TEXT,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- System Settings
CREATE TABLE "SystemSetting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
