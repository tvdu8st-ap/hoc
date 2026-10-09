// In-memory persistent database storage implementing the Prisma Schema model
// for "Góc Lắng Nghe - Cùng Em Trưởng Thành"

export interface User {
  id: string;
  username: string;
  email?: string;
  passwordHash: string;
  fullName: string;
  role: 'STUDENT' | 'PARENT' | 'TEACHER' | 'COUNSELOR' | 'ADMIN';
  gradeLevel: 'PRIMARY' | 'SECONDARY' | 'GENERAL';
  phoneNumber?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  schoolClass: string;
  parentName?: string;
  parentContact?: string;
  emergencyNote?: string;
}

export interface CounselingRequest {
  id: string;
  requestCode: string;
  gradeLevel: 'PRIMARY' | 'SECONDARY' | 'GENERAL';
  topic: 'STUDY_PRESSURE' | 'PEER_FRIENDSHIP' | 'FAMILY_RELATION' | 'EMOTIONAL_STRESS' | 'SCHOOL_BULLYING' | 'CYBER_BULLYING' | 'COMMUNICATION_SKILL' | 'PUBERTY_GROWTH' | 'OTHER';
  isAnonymous: boolean;
  studentAlias?: string;
  studentClass?: string;
  contactMethod: string;
  contactValue?: string;
  preferredTime?: string;
  content: string;
  status: 'RECEIVED' | 'CLASSIFYING' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING_FEEDBACK' | 'RESOLVED' | 'CLOSED';
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
  isPrivate: boolean; // Never exposed to student
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
  studentId?: string;
  studentName: string;
  studentContact?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
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
  gradeLevel: 'PRIMARY' | 'SECONDARY' | 'GENERAL';
  readTimeMinutes: number;
  isPublished: boolean;
  authorName: string;
  createdAt: string;
}

export interface BullyingReport {
  id: string;
  reportCode: string;
  gradeLevel: 'PRIMARY' | 'SECONDARY' | 'GENERAL';
  victimType: string;
  incidentType: string;
  location?: string;
  incidentDate?: string;
  description: string;
  safeContact?: string;
  isAnonymous: boolean;
  status: 'URGENT_REVIEW' | 'INVESTIGATING' | 'SUPPORTING' | 'RESOLVED';
  actionPlan?: string;
  createdAt: string;
}

export interface EmotionCheckin {
  id: string;
  sessionId?: string;
  moodKey: string;
  moodLabel: string;
  energyScore?: number;
  note?: string;
  gradeLevel: 'PRIMARY' | 'SECONDARY' | 'GENERAL';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  username?: string;
  actionType: string;
  targetResource: string;
  details?: string;
  createdAt: string;
}

// Initial demo database seeds (Safe, pedagocially appropriate Vietnamese school context)
class DatabaseStore {
  users: User[] = [
    {
      id: 'usr-student-1',
      username: 'hocsinh.an',
      fullName: 'Trần Hoài An',
      role: 'STUDENT',
      gradeLevel: 'SECONDARY',
      passwordHash: 'demo123', // In demo, verified by hash check
      isActive: true,
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'usr-student-2',
      username: 'hocsinh.binh',
      fullName: 'Nguyễn Thanh Bình',
      role: 'STUDENT',
      gradeLevel: 'PRIMARY',
      passwordHash: 'demo123',
      isActive: true,
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'usr-counselor-1',
      username: 'tuvan.tuananh',
      fullName: 'ThS. Tâm lý Nguyễn Tuấn Anh',
      role: 'COUNSELOR',
      gradeLevel: 'GENERAL',
      phoneNumber: '0912 345 678',
      passwordHash: 'demo123',
      isActive: true,
      createdAt: '2026-08-15T08:00:00Z',
    },
    {
      id: 'usr-counselor-2',
      username: 'tuvan.thuytrang',
      fullName: 'Cô Nguyễn Thị Thùy Trang (Tư vấn Tiểu học)',
      role: 'COUNSELOR',
      gradeLevel: 'PRIMARY',
      phoneNumber: '0912 888 999',
      passwordHash: 'demo123',
      isActive: true,
      createdAt: '2026-08-15T08:00:00Z',
    },
    {
      id: 'usr-teacher-1',
      username: 'gvcn.lan',
      fullName: 'Cô Nguyễn Thị Mai Lan (GVCN Lớp 7A2)',
      role: 'TEACHER',
      gradeLevel: 'SECONDARY',
      passwordHash: 'demo123',
      isActive: true,
      createdAt: '2026-08-20T08:00:00Z',
    },
    {
      id: 'usr-parent-1',
      username: 'phuhuynh.mai',
      fullName: 'Chị Hoàng Tuyết Mai (Phụ huynh em Hoài An)',
      role: 'PARENT',
      gradeLevel: 'SECONDARY',
      phoneNumber: '0988 777 666',
      passwordHash: 'demo123',
      isActive: true,
      createdAt: '2026-09-02T08:00:00Z',
    },
    {
      id: 'usr-admin-1',
      username: 'quantri.minh',
      fullName: 'Thầy Phạm Quang Minh (BGH - Trưởng ban Tâm lý)',
      role: 'ADMIN',
      gradeLevel: 'GENERAL',
      passwordHash: 'admin123',
      isActive: true,
      createdAt: '2026-08-01T08:00:00Z',
    },
  ];

  requests: CounselingRequest[] = [
    {
      id: 'req-001',
      requestCode: 'GLN-739218',
      gradeLevel: 'SECONDARY',
      topic: 'STUDY_PRESSURE',
      isAnonymous: false,
      studentAlias: 'Em H.A (Lớp 8)',
      studentClass: '8B',
      contactMethod: 'Gặp trực tiếp giờ ra chơi tại phòng tư vấn',
      contactValue: 'Phòng 204',
      preferredTime: 'Ra chơi tiết 3 thứ Ba hoặc thứ Năm',
      content: 'Dạo gần đây em cảm thấy rất lo lắng trước mỗi kỳ kiểm tra giữa kỳ. Dù em đã ôn bài kỹ nhưng khi phát đề em thường bị tim đập nhanh và quên kiến thức. Em sợ làm bố mẹ thất vọng.',
      status: 'IN_PROGRESS',
      urgencyLevel: 'NORMAL',
      privacyAgreed: true,
      assignedCounselorId: 'usr-counselor-1',
      createdAt: '2026-10-02T09:30:00Z',
      updatedAt: '2026-10-03T14:15:00Z',
    },
    {
      id: 'req-002',
      requestCode: 'GLN-482015',
      gradeLevel: 'SECONDARY',
      topic: 'PEER_FRIENDSHIP',
      isAnonymous: true,
      studentAlias: 'Bạn Cỏ May 7A',
      studentClass: 'Khối 7',
      contactMethod: 'Hòm thư điện tử bảo mật',
      contactValue: 'hopthubimat@truong.edu.vn',
      preferredTime: 'Sau 17h00 chiều',
      content: 'Nhóm bạn thân từ năm lớp 6 bỗng nhiên lập một nhóm chat riêng và không rủ em đi ăn trưa nữa. Em cảm thấy bị cô lập và không biết mình đã làm sai điều gì.',
      status: 'WAITING_FEEDBACK',
      urgencyLevel: 'NORMAL',
      privacyAgreed: true,
      assignedCounselorId: 'usr-counselor-1',
      createdAt: '2026-10-04T11:00:00Z',
      updatedAt: '2026-10-05T08:20:00Z',
    },
    {
      id: 'req-003',
      requestCode: 'GLN-991204',
      gradeLevel: 'PRIMARY',
      topic: 'EMOTIONAL_STRESS',
      isAnonymous: true,
      studentAlias: 'Bé Mầm Non 4C',
      studentClass: '4C',
      contactMethod: 'Nhắn qua cô phụ trách tư vấn',
      contactValue: 'Cô Thùy Trang',
      preferredTime: 'Giờ nghỉ trưa',
      content: 'Em rất nhớ mẹ vì mẹ đi công tác xa. Ở lớp em hay buồn và muốn khóc khi nhìn các bạn được mẹ đón sớm.',
      status: 'ASSIGNED',
      urgencyLevel: 'NORMAL',
      privacyAgreed: true,
      assignedCounselorId: 'usr-counselor-2',
      createdAt: '2026-10-06T13:45:00Z',
      updatedAt: '2026-10-06T15:00:00Z',
    },
    {
      id: 'req-004',
      requestCode: 'GLN-110294',
      gradeLevel: 'SECONDARY',
      topic: 'CYBER_BULLYING',
      isAnonymous: false,
      studentAlias: 'Học sinh khối 9',
      studentClass: '9A1',
      contactMethod: 'Gặp trực tiếp riêng tư',
      contactValue: '0933xxxxxx',
      preferredTime: 'Sau giờ sinh hoạt thứ Sáu',
      content: 'Có một tài khoản ẩn danh trên Facebook đăng ảnh chế giễu ngoại hình của em trong nhóm kín của trường. Các bạn để lại bình luận trêu chọc làm em rất sợ đến trường.',
      status: 'CLASSIFYING',
      urgencyLevel: 'URGENT',
      privacyAgreed: true,
      assignedCounselorId: 'usr-counselor-1',
      createdAt: '2026-10-08T10:15:00Z',
      updatedAt: '2026-10-08T10:30:00Z',
    },
  ];

  messages: RequestMessage[] = [
    {
      id: 'msg-001',
      requestId: 'req-001',
      senderType: 'COUNSELOR',
      senderName: 'Thầy Nguyễn Tuấn Anh (Tư vấn học đường)',
      message: 'Chào em, thầy đã đọc kỹ chia sẻ của em. Cảm giác hồi hộp trước kiểm tra là phản ứng tự nhiên của cơ thể khi em rất có trách nhiệm với việc học. Thầy đã xếp lịch gặp em vào thứ Ba tuần tới lúc 9h15 nhé. Em thử bài tập hít thở 4-4 ở Góc Cảm Xúc trước nhé!',
      createdAt: '2026-10-03T10:00:00Z',
    },
    {
      id: 'msg-002',
      requestId: 'req-001',
      senderType: 'STUDENT',
      senderName: 'Em H.A',
      message: 'Dạ vâng ạ, em cảm ơn thầy. Thứ Ba ra chơi tiết 3 em sẽ qua phòng 204 ạ.',
      createdAt: '2026-10-03T14:15:00Z',
    },
    {
      id: 'msg-003',
      requestId: 'req-002',
      senderType: 'COUNSELOR',
      senderName: 'Thầy Nguyễn Tuấn Anh',
      message: 'Thầy hiểu cảm giác hụt hẫng và trống trải khi nhóm bạn thân bỗng nhiên xa cách. Việc này không có nghĩa là em có lỗi. Thầy gợi ý một số cách trò chuyện chân thành với một bạn em tin tưởng nhất trong nhóm.',
      createdAt: '2026-10-05T08:20:00Z',
    },
  ];

  notes: CounselingNote[] = [
    {
      id: 'note-001',
      requestId: 'req-001',
      authorId: 'usr-counselor-1',
      authorName: 'ThS. Nguyễn Tuấn Anh',
      isPrivate: true,
      actionTaken: 'Đã hẹn gặp trực tiếp tại P204, hướng dẫn kỹ thuật kiểm soát lo âu nhận thức hành vi (CBT) cơ bản.',
      noteContent: 'Học sinh có biểu hiện lo âu thi cử (Test Anxiety) ở mức độ nhẹ - trung bình. Nguyên nhân xuất phát từ áp lực kỳ vọng cao từ phía gia đình. Cần phối hợp gợi mở với phụ huynh giảm áp lực thành tích.',
      createdAt: '2026-10-03T10:30:00Z',
    },
    {
      id: 'note-002',
      requestId: 'req-004',
      authorId: 'usr-counselor-1',
      authorName: 'ThS. Nguyễn Tuấn Anh',
      isPrivate: true,
      actionTaken: 'Đã báo cáo BGH và bộ phận Đoàn Đội để xác minh trang quản trị viên nhóm ẩn danh.',
      noteContent: 'Vụ việc bắt nạt mạng có dấu hiệu lan rộng. Cần ưu tiên ổn định tâm lý học sinh bị hại trước, tuyệt đối bảo mật danh tính khi làm việc với các học sinh liên quan.',
      createdAt: '2026-10-08T10:45:00Z',
    },
  ];

  appointments: CounselingAppointment[] = [
    {
      id: 'apt-001',
      appointmentCode: 'LICH-26101',
      requestId: 'req-001',
      counselorId: 'usr-counselor-1',
      counselorName: 'ThS. Nguyễn Tuấn Anh',
      studentName: 'Trần Hoài An',
      studentContact: '0988 777 666',
      date: '2026-10-14',
      startTime: '09:15',
      endTime: '09:45',
      format: 'IN_PERSON',
      location: 'Phòng Tư vấn Tâm lý Học đường (P.204)',
      status: 'CONFIRMED',
      reasonTopic: 'STUDY_PRESSURE',
      privateNotes: 'Chuẩn bị tài liệu kỹ thuật hít thở sâu và bảng kế hoạch học tập Pomodoro.',
      createdAt: '2026-10-03T10:15:00Z',
    },
    {
      id: 'apt-002',
      appointmentCode: 'LICH-26102',
      requestId: 'req-003',
      counselorId: 'usr-counselor-2',
      counselorName: 'Cô Nguyễn Thị Thùy Trang',
      studentName: 'Bé Mầm Non 4C',
      date: '2026-10-15',
      startTime: '11:45',
      endTime: '12:15',
      format: 'IN_PERSON',
      location: 'Góc Trò Chuyện Thân Thiện (Tầng 1 Khối Tiểu học)',
      status: 'SCHEDULED',
      reasonTopic: 'EMOTIONAL_STRESS',
      privateNotes: 'Sử dụng thú bông và tranh vẽ cảm xúc để bé giãi bày.',
      createdAt: '2026-10-06T15:00:00Z',
    },
    {
      id: 'apt-003',
      appointmentCode: 'LICH-26103',
      counselorId: 'usr-counselor-1',
      counselorName: 'ThS. Nguyễn Tuấn Anh',
      studentName: 'Nguyễn Văn Đạt (Khối 9)',
      studentContact: '0912 111 222',
      date: '2026-10-16',
      startTime: '15:30',
      endTime: '16:15',
      format: 'PRIVATE_ONLINE',
      location: 'Phòng họp trực tuyến bảo mật của trường (Mã phòng riêng)',
      status: 'SCHEDULED',
      reasonTopic: 'PUBERTY_GROWTH',
      privateNotes: 'Tư vấn định hướng tâm lý tuổi dậy thì và chia sẻ cùng phụ huynh.',
      createdAt: '2026-10-07T16:00:00Z',
    },
  ];

  resources: EducationalResource[] = [
    {
      id: 'res-001',
      title: '5 Bước Đánh Bay Nỗi Sợ Phòng Thi Dành Cho Học Sinh THCS',
      slug: '5-buoc-danh-bay-noi-so-phong-thi',
      summary: 'Làm thế nào để giữ một cái đầu lạnh và trái tim ấm áp trước những kỳ thi cam go? Bỏ túi ngay bí quyết hít thở 4-4 và kỹ thuật đổi góc nhìn.',
      content: `Khi bạn bước vào phòng thi và thấy tim mình đập thình thịch, hãy nhớ rằng đây là phản xạ tự nhiên của cơ thể để bơm thêm oxy lên não. Đừng hoảng sợ! 
      
1. Dừng lại 30 giây: Nhắm mắt nhẹ nhàng và thực hiện 3 nhịp hít sâu bằng mũi, thở chậm bằng miệng.
2. Uống một ngụm nước nhỏ: Não bộ cần đủ nước để các nơ-ron dẫn truyền thông suốt.
3. Đọc lướt toàn bài: Làm câu dễ trước để tích lũy sự tự tin và "khởi động" dòng suy nghĩ.
4. Tách biệt kết quả khỏi giá trị bản thân: Điểm số là thước đo của một bài kiểm tra, không định nghĩa con người hay tương lai của bạn.`,
      category: 'Áp lực học tập',
      gradeLevel: 'SECONDARY',
      readTimeMinutes: 4,
      isPublished: true,
      authorName: 'ThS. Nguyễn Tuấn Anh',
      createdAt: '2026-09-10T10:00:00Z',
    },
    {
      id: 'res-002',
      title: 'Chú Gấu Nhỏ Học Cách Nói Lời Xin Lỗi Và Làm Hòa Cùng Bạn',
      slug: 'chu-gau-nho-hoc-cach-lam-hoa',
      summary: 'Truyện tranh ngắn dễ hiểu giúp các bé Tiểu học nhận diện cơn giận và cách làm hòa chân thành khi lỡ tranh đồ chơi của bạn.',
      content: `Có một chú Gấu Nâu thích chơi khối xếp hình. Một hôm, Thỏ Trắng vô tình làm đổ tòa lâu đài của Gấu. Gấu Nâu hét to và giậm chân bình bịch!

Bác Voi hiền lành đi tới và bảo: "Gấu Nâu ơi, khi tức giận, ngực chú có thấy nóng ran không? Hãy đặt tay lên bụng, hít một hơi như ngửi mùi hoa thơm, rồi thổi nhẹ như thổi tắt ngọn nến nhé."

Gấu Nâu làm theo ba lần. Lạ kỳ thay, cục tức trong bụng như tan biến. Thỏ Trắng rụt rè nói: "Tớ xin lỗi Gấu, tớ không cố ý đâu. Chúng mình cùng xây lại nhé!" Gấu Nâu mỉm cười gật đầu.`,
      category: 'Kỹ năng cảm xúc',
      gradeLevel: 'PRIMARY',
      readTimeMinutes: 3,
      isPublished: true,
      authorName: 'Cô Nguyễn Thị Thùy Trang',
      createdAt: '2026-09-15T09:00:00Z',
    },
    {
      id: 'res-003',
      title: 'Bắt Nạt Mạng (Cyberbullying): Làm Gì Khi Bị Xúc Phạm Trên Mạng Xã Hội?',
      slug: 'phong-chong-bat-nat-tren-mang-xa-hoi',
      summary: 'Cẩm nang 4 bước vàng: Chụp màn hình bằng chứng - Chặn kẻ xấu - Không đôi co trả thù - Báo ngay cho người lớn tin cậy.',
      content: `Không gian mạng không phải là vùng đất vô luật pháp. Bất kỳ ai sử dụng lời lẽ miệt thị, bôi nhọ hoặc chia sẻ hình ảnh riêng tư không xin phép đều đang vi phạm quy tắc đạo đức và pháp luật.

Nếu bạn hoặc bạn bè gặp phải:
1. KHÔNG trả đũa: Kẻ bắt nạt thường kích động để bạn mất bình tĩnh.
2. LƯU BẰNG CHỨNG: Chụp ảnh màn hình toàn bộ bài viết, bình luận, tin nhắn kèm thời gian rõ ràng.
3. CHẶN VÀ BÁO CÁO: Sử dụng tính năng Block/Report của nền tảng mạng xã hội.
4. CHIA SẺ VỚI NGƯỜI LỚN: Hãy gửi yêu cầu hỗ trợ qua Góc Lắng Nghe hoặc gặp thầy cô tư vấn. Bạn hoàn toàn không đơn độc!`,
      category: 'Phòng chống bắt nạt',
      gradeLevel: 'SECONDARY',
      readTimeMinutes: 5,
      isPublished: true,
      authorName: 'Ban Tư vấn Học đường',
      createdAt: '2026-09-20T14:00:00Z',
    },
    {
      id: 'res-004',
      title: 'Dành Cho Cha Mẹ: Lắng Nghe Con Tuổi Dậy Thì Mà Không Phán Xét',
      slug: 'cha-me-lang-nghe-con-tuoi-day-thi',
      summary: 'Những thay đổi tâm sinh lý tuổi dậy thì và chìa khóa kết nối trái tim giữa cha mẹ và con cái.',
      content: `Khi con bước vào lứa tuổi 11 - 15, não bộ đang trải qua giai đoạn tái cấu trúc mạnh mẽ. Con khao khát được công nhận là một cá nhân độc lập nhưng vẫn rất cần sự chở che an toàn từ cha mẹ.

- Hãy lắng nghe trọn vẹn trước khi đưa ra lời khuyên.
- Tôn trọng không gian riêng tư của con (phòng ngủ, nhật ký cá nhân).
- Đặt câu hỏi mở thay vì tra khảo: "Hôm nay ở trường có điều gì làm con vui nhất/khó chịu nhất không?"`,
      category: 'Dành cho phụ huynh',
      gradeLevel: 'GENERAL',
      readTimeMinutes: 6,
      isPublished: true,
      authorName: 'ThS. Nguyễn Tuấn Anh',
      createdAt: '2026-09-25T11:00:00Z',
    },
  ];

  bullyingReports: BullyingReport[] = [
    {
      id: 'bul-001',
      reportCode: 'BCBN-9021',
      gradeLevel: 'SECONDARY',
      victimType: 'Em chứng kiến bạn khác bị',
      incidentType: 'Cô lập tẩy chay và châm chọc ngoại hình',
      location: 'Khu vực căng-tin trường giờ ra chơi',
      incidentDate: '2026-10-07',
      description: 'Có một nhóm 3 bạn nam lớp 8 thường xuyên chặn một bạn nhỏ con hơn ở lối cầu thang, giật hộp bút và gọi bạn bằng biệt danh xúc phạm.',
      safeContact: 'Em xin giấu tên để bảo vệ bản thân',
      isAnonymous: true,
      status: 'INVESTIGATING',
      actionPlan: 'Đã phân công giáo viên giám thị theo dõi khu vực cầu thang số 2, làm việc tế nhị với học sinh liên quan.',
      createdAt: '2026-10-07T11:30:00Z',
    },
  ];

  emotions: EmotionCheckin[] = [
    {
      id: 'emo-001',
      moodKey: 'HAPPY',
      moodLabel: 'Vui vẻ, phấn khởi',
      energyScore: 5,
      note: 'Hôm nay em làm bài kiểm tra Toán rất tốt và được cô khen!',
      gradeLevel: 'PRIMARY',
      createdAt: '2026-10-08T10:00:00Z',
    },
    {
      id: 'emo-002',
      moodKey: 'WORRIED',
      moodLabel: 'Lo lắng, hồi hộp',
      energyScore: 2,
      note: 'Tuần sau trường có kỳ thi khảo sát chất lượng.',
      gradeLevel: 'SECONDARY',
      createdAt: '2026-10-08T11:15:00Z',
    },
  ];

  auditLogs: AuditLog[] = [
    {
      id: 'log-001',
      username: 'quantri.minh',
      actionType: 'SYSTEM_STARTUP',
      targetResource: 'SYSTEM',
      details: 'Khởi động hệ thống Góc Lắng Nghe - Cùng Em Trưởng Thành thành công',
      createdAt: '2026-10-08T00:00:00Z',
    },
    {
      id: 'log-002',
      username: 'tuvan.tuan',
      actionType: 'UPDATE_STATUS',
      targetResource: 'GLN-739218',
      details: 'Cập nhật trạng thái phiếu tư vấn thành Đang hỗ trợ (IN_PROGRESS)',
      createdAt: '2026-10-03T10:00:00Z',
    },
  ];

  // Helper methods
  findUserByUsername(username: string): User | undefined {
    return this.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  findUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getRequestByCode(code: string): CounselingRequest | undefined {
    return this.requests.find((r) => r.requestCode.toUpperCase() === code.trim().toUpperCase());
  }

  getRequestById(id: string): CounselingRequest | undefined {
    return this.requests.find((r) => r.id === id);
  }

  addAuditLog(username: string, actionType: string, targetResource: string, details?: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      username,
      actionType,
      targetResource,
      details,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 200) this.auditLogs.pop();
    return log;
  }
}

export const db = new DatabaseStore();
