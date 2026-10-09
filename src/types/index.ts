export type RoleType = 'STUDENT' | 'PARENT' | 'TEACHER' | 'COUNSELOR' | 'ADMIN';
export type GradeLevel = 'PRIMARY' | 'SECONDARY' | 'GENERAL';

export interface User {
  id: string;
  username: string;
  email?: string;
  fullName: string;
  role: RoleType;
  gradeLevel: GradeLevel;
  phoneNumber?: string;
  avatarUrl?: string;
}

export type RequestTopic =
  | 'STUDY_PRESSURE'
  | 'PEER_FRIENDSHIP'
  | 'FAMILY_RELATION'
  | 'EMOTIONAL_STRESS'
  | 'SCHOOL_BULLYING'
  | 'CYBER_BULLYING'
  | 'COMMUNICATION_SKILL'
  | 'PUBERTY_GROWTH'
  | 'OTHER';

export type RequestStatus =
  | 'RECEIVED'
  | 'CLASSIFYING'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'WAITING_FEEDBACK'
  | 'RESOLVED'
  | 'CLOSED';

export interface CounselingRequest {
  id: string;
  requestCode: string;
  gradeLevel: GradeLevel;
  topic: RequestTopic;
  isAnonymous: boolean;
  studentAlias?: string;
  studentClass?: string;
  contactMethod: string;
  contactValue?: string;
  preferredTime?: string;
  content: string;
  status: RequestStatus;
  urgencyLevel: 'NORMAL' | 'URGENT' | 'EMERGENCY';
  privacyAgreed: boolean;
  assignedCounselorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RequestMessage {
  id: string;
  requestId: string;
  senderType: 'STUDENT' | 'COUNSELOR';
  senderName: string;
  message: string;
  createdAt: string;
}

export interface CounselingNote {
  id: string;
  requestId: string;
  authorId: string;
  authorName: string;
  isPrivate: boolean;
  actionTaken?: string;
  noteContent: string;
  createdAt: string;
}

export interface CounselingAppointment {
  id: string;
  appointmentCode: string;
  requestId?: string;
  counselorId: string;
  counselorName: string;
  studentName: string;
  studentContact?: string;
  date: string;
  startTime: string;
  endTime: string;
  format: 'IN_PERSON' | 'PRIVATE_ONLINE' | 'PHONE_SAFE';
  location: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'RESCHEDULED' | 'CANCELLED';
  reasonTopic: string;
  privateNotes?: string;
  createdAt: string;
}

export interface EducationalResource {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  gradeLevel: GradeLevel;
  readTimeMinutes: number;
  isPublished: boolean;
  authorName: string;
  createdAt: string;
}

export interface BullyingReport {
  id: string;
  reportCode: string;
  gradeLevel: GradeLevel;
  victimType: string;
  incidentType: string;
  location?: string;
  incidentDate?: string;
  description: string;
  safeContact?: string;
  isAnonymous: boolean;
  status: string;
  actionPlan?: string;
  createdAt: string;
}

export interface EmotionCheckin {
  id: string;
  moodKey: string;
  moodLabel: string;
  energyScore?: number;
  note?: string;
  gradeLevel: GradeLevel;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  username?: string;
  actionType: string;
  targetResource: string;
  details?: string;
  createdAt: string;
}

export const TOPIC_LABELS: Record<RequestTopic, string> = {
  STUDY_PRESSURE: 'Áp lực học tập & thi cử',
  PEER_FRIENDSHIP: 'Tình bạn & mâu thuẫn bạn bè',
  FAMILY_RELATION: 'Quan hệ gia đình, bố mẹ',
  EMOTIONAL_STRESS: 'Căng thẳng, lo âu & buồn bã',
  SCHOOL_BULLYING: 'Bắt nạt tại trường học',
  CYBER_BULLYING: 'Bắt nạt & xúc phạm trên mạng',
  COMMUNICATION_SKILL: 'Kỹ năng giao tiếp & tự tin',
  PUBERTY_GROWTH: 'Tâm sinh lý tuổi dậy thì',
  OTHER: 'Vấn đề cần chia sẻ khác',
};

export const STATUS_LABELS: Record<RequestStatus, { label: string; color: string; desc: string }> = {
  RECEIVED: { label: 'Mới tiếp nhận', color: 'bg-blue-100 text-blue-800 border-blue-200', desc: 'Hệ thống đã nhận phiếu chia sẻ an toàn.' },
  CLASSIFYING: { label: 'Đang phân loại', color: 'bg-amber-100 text-amber-800 border-amber-200', desc: 'Thầy cô tư vấn đang xem xét chủ đề và mức độ hỗ trợ.' },
  ASSIGNED: { label: 'Đã phân công', color: 'bg-purple-100 text-purple-800 border-purple-200', desc: 'Đã chuyển phiếu tới chuyên viên tâm lý phù hợp.' },
  IN_PROGRESS: { label: 'Đang hỗ trợ', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', desc: 'Thầy cô đang đồng hành và hỗ trợ giải quyết vấn đề.' },
  WAITING_FEEDBACK: { label: 'Chờ trao đổi tiếp', color: 'bg-orange-100 text-orange-800 border-orange-200', desc: 'Có tin nhắn mới từ thầy cô, mời em phản hồi khi thuận tiện.' },
  RESOLVED: { label: 'Đã hoàn tất', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', desc: 'Vấn đề đã được hỗ trợ ổn thỏa và đạt kết quả tích cực.' },
  CLOSED: { label: 'Đã đóng theo quy trình', color: 'bg-slate-100 text-slate-700 border-slate-200', desc: 'Phiếu đã lưu trữ an toàn theo quy định bảo mật học đường.' },
};
