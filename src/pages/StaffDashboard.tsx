import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  CounselingRequest,
  CounselingAppointment,
  BullyingReport,
  TOPIC_LABELS,
  STATUS_LABELS,
  RequestStatus,
  RequestTopic,
  AuditLog,
} from '../types';
import {
  LayoutDashboard,
  Inbox,
  Calendar,
  ShieldAlert,
  BookOpen,
  History,
  Lock,
  Search,
  Filter,
  CheckCircle,
  Clock,
  User,
  Plus,
  Send,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { user, token, switchDemoUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'REQUESTS' | 'APPOINTMENTS' | 'BULLYING' | 'RESOURCES' | 'AUDIT'>('OVERVIEW');

  // Data states
  const [requests, setRequests] = useState<CounselingRequest[]>([]);
  const [appointments, setAppointments] = useState<CounselingAppointment[]>([]);
  const [bullyingReports, setBullyingReports] = useState<BullyingReport[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Selected request modal / detail view
  const [selectedRequest, setSelectedRequest] = useState<CounselingRequest | null>(null);
  const [internalNotes, setInternalNotes] = useState<any[]>([]);
  const [newInternalNote, setNewInternalNote] = useState('');
  const [newActionTaken, setNewActionTaken] = useState('');
  const [counselorReply, setCounselorReply] = useState('');

  // Resource creation state
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceSummary, setNewResourceSummary] = useState('');
  const [newResourceContent, setNewResourceContent] = useState('');
  const [newResourceCategory, setNewResourceCategory] = useState('Áp lực học tập');
  const [newResourceGrade, setNewResourceGrade] = useState('SECONDARY');
  const [resourceSuccess, setResourceSuccess] = useState(false);

  const isStaff = user && ['COUNSELOR', 'TEACHER', 'ADMIN'].includes(user.role);

  useEffect(() => {
    if (isStaff) {
      loadDashboardData();
    }
  }, [user, activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token || user?.id}`,
    };

    try {
      const [reqRes, aptRes, bulRes, statsRes] = await Promise.all([
        fetch('/api/counseling/requests', { headers }).then((r) => r.json()),
        fetch('/api/appointments/staff', { headers }).then((r) => r.json()),
        fetch('/api/bullying', { headers }).then((r) => r.json()),
        fetch('/api/stats', { headers }).then((r) => r.json()),
      ]);

      if (reqRes.success) setRequests(reqRes.requests);
      if (aptRes.success) setAppointments(aptRes.appointments);
      if (bulRes.success) setBullyingReports(bulRes.reports);
      if (statsRes.success) setStats(statsRes.stats);

      if (user?.role === 'ADMIN') {
        const auditRes = await fetch('/api/audit-logs', { headers }).then((r) => r.json());
        if (auditRes.success) setAuditLogs(auditRes.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRequestDetail = async (req: CounselingRequest) => {
    setSelectedRequest(req);
    // Fetch internal clinical notes
    try {
      const res = await fetch(`/api/counseling/requests/${req.id}/notes`, {
        headers: { Authorization: `Bearer ${token || user?.id}` },
      });
      const data = await res.json();
      if (data.success) {
        setInternalNotes(data.notes);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateRequestStatus = async (status: RequestStatus) => {
    if (!selectedRequest) return;
    try {
      const res = await fetch(`/api/counseling/requests/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || user?.id}`,
        },
        body: JSON.stringify({
          status,
          counselorReply: counselorReply.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedRequest(data.request);
        setCounselorReply('');
        loadDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !newInternalNote.trim()) return;

    try {
      const res = await fetch(`/api/counseling/requests/${selectedRequest.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || user?.id}`,
        },
        body: JSON.stringify({
          actionTaken: newActionTaken.trim(),
          noteContent: newInternalNote.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInternalNotes([...internalNotes, data.note]);
        setNewInternalNote('');
        setNewActionTaken('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResourceTitle.trim() || !newResourceContent.trim()) return;

    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || user?.id}`,
        },
        body: JSON.stringify({
          title: newResourceTitle,
          summary: newResourceSummary,
          content: newResourceContent,
          category: newResourceCategory,
          gradeLevel: newResourceGrade,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResourceSuccess(true);
        setNewResourceTitle('');
        setNewResourceSummary('');
        setNewResourceContent('');
        setTimeout(() => setResourceSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // If user is not staff, show polite RBAC barrier
  if (!isStaff) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Khu Vực Dành Cho Ban Tư Vấn & Giáo Viên
          </h1>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Hồ sơ học sinh và các ghi chú tâm lý được bảo mật nghiêm ngặt. Để kiểm thử hoặc đánh giá chức năng này, bạn có thể chuyển đổi nhanh sang vai trò chuyên viên hoặc quản trị viên bên dưới:
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => switchDemoUser('COUNSELOR')}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors"
          >
            🩺 Thử vai: Thầy Tuấn Anh (Tư vấn viên)
          </button>
          <button
            onClick={() => switchDemoUser('TEACHER')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
          >
            👩‍🏫 Thử vai: Cô Lan (GVCN)
          </button>
          <button
            onClick={() => switchDemoUser('ADMIN')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            🛡️ Thử vai: Thầy Minh (Quản trị BGH)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">
                Bảng Điều Khiển Tư Vấn Học Đường
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-sky-100 text-sky-800">
                {user.role}: {user.fullName}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống xử lý hồ sơ tâm lý bảo mật • Chuẩn mực nghiệp vụ sư phạm
            </p>
          </div>
        </div>

        <button
          onClick={loadDashboardData}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Làm mới dữ liệu</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200">
        {[
          { id: 'OVERVIEW', label: 'Tổng quan & Thống kê', icon: LayoutDashboard },
          { id: 'REQUESTS', label: `Hồ sơ chia sẻ (${requests.length})`, icon: Inbox },
          { id: 'APPOINTMENTS', label: `Lịch tư vấn (${appointments.length})`, icon: Calendar },
          { id: 'BULLYING', label: `Báo cáo bắt nạt (${bullyingReports.length})`, icon: ShieldAlert },
          { id: 'RESOURCES', label: 'Quản lý học liệu', icon: BookOpen },
          ...(user.role === 'ADMIN' ? [{ id: 'AUDIT', label: 'Nhật ký bảo mật', icon: History }] : []),
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold rounded-2xl flex items-center gap-2 shrink-0 transition-all ${
                active
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Key Stat Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Tổng phiếu tâm sự
              </span>
              <div className="text-3xl font-black text-slate-900 mt-1">
                {stats?.totalRequests ?? requests.length}
              </div>
              <span className="text-[11px] text-sky-600 mt-1 block">
                {stats?.inProgressRequests ?? 2} ca đang hỗ trợ
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Đã hoàn tất hỗ trợ
              </span>
              <div className="text-3xl font-black text-emerald-600 mt-1">
                {stats?.resolvedRequests ?? 1}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Đóng theo quy trình an toàn</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Lịch hẹn tư vấn
              </span>
              <div className="text-3xl font-black text-indigo-600 mt-1">
                {stats?.totalAppointments ?? appointments.length}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Tại Phòng 204 & trực tuyến</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Báo cáo bắt nạt
              </span>
              <div className="text-3xl font-black text-rose-600 mt-1">
                {stats?.bullyingCount ?? bullyingReports.length}
              </div>
              <span className="text-[11px] text-rose-600 mt-1 block">Cần giám sát liên tục</span>
            </div>
          </div>

          {/* Aggregated Topic Distribution (Privacy Compliant) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">
                Phân Bổ Chủ Đề Tư Vấn (Dữ liệu ẩn danh)
              </h3>
              <div className="space-y-2.5">
                {Object.entries(TOPIC_LABELS).map(([k, label]) => {
                  const count = requests.filter((r) => r.topic === k).length;
                  const percent = requests.length ? Math.round((count / requests.length) * 100) : 0;
                  return (
                    <div key={k} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-700">
                        <span className="font-medium">{label}</span>
                        <span className="font-bold">{count} ({percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-sky-600 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">
                Nguyên Tắc Làm Việc Của Ban Tư Vấn
              </h3>
              <ul className="text-xs text-slate-600 space-y-3 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Không gắn nhãn bệnh lý:</strong> Học sinh cần sự thấu cảm, không phán xét và không tự chẩn đoán bệnh tâm thần.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Ghi chú nội bộ cách ly hoàn toàn:</strong> Chỉ chuyên viên tư vấn và ban chuyên môn mới có quyền truy cập hồ sơ nghiệp vụ.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Ưu tiên an toàn tính mạng:</strong> Khi phát hiện nguy cơ bạo lực hoặc tự tổn thương, lập tức kích hoạt quy trình can thiệp khẩn cấp (111).
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REQUESTS TRIAGE */}
      {activeTab === 'REQUESTS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Mã Phiếu</th>
                  <th className="py-3 px-4">Cấp học</th>
                  <th className="py-3 px-4">Chủ đề</th>
                  <th className="py-3 px-4">Học sinh / Biệt danh</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-700">
                      {r.requestCode}
                    </td>
                    <td className="py-3.5 px-4">
                      {r.gradeLevel === 'PRIMARY' ? '🧸 Tiểu học' : '🎓 THCS'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {TOPIC_LABELS[r.topic] || r.topic}
                    </td>
                    <td className="py-3.5 px-4">
                      {r.studentAlias || (r.isAnonymous ? 'Ẩn danh' : 'Học sinh')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                          STATUS_LABELS[r.status]?.color || 'bg-slate-100'
                        }`}
                      >
                        {STATUS_LABELS[r.status]?.label || r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenRequestDetail(r)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
                      >
                        Xử lý hồ sơ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: APPOINTMENTS */}
      {activeTab === 'APPOINTMENTS' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Danh Sách Lịch Tư Vấn Học Đường
          </h2>
          <div className="divide-y divide-slate-100">
            {appointments.map((apt) => (
              <div key={apt.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-700">{apt.appointmentCode}</span>
                    <span className="font-bold text-slate-900 text-sm">{apt.studentName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      {apt.status}
                    </span>
                  </div>
                  <div className="text-slate-500">
                    Thời gian: <strong>{apt.startTime} - {apt.endTime} ({apt.date})</strong> • Địa điểm: <strong>{apt.location}</strong>
                  </div>
                  <div className="text-slate-500">
                    Chuyên viên: <strong>{apt.counselorName}</strong> • Chủ đề: <strong>{TOPIC_LABELS[apt.reasonTopic as RequestTopic] || apt.reasonTopic}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl">
                    Đã hoàn thành ca
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BULLYING REPORTS */}
      {activeTab === 'BULLYING' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Báo Cáo Bạo Lực & Bắt Nạt Học Đường
              </h2>
              <p className="text-xs text-slate-500">Tiếp nhận trực tiếp từ học sinh và người chứng kiến</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-rose-100 text-rose-800 rounded-full">
              Ưu tiên xử lý khẩn
            </span>
          </div>

          <div className="space-y-4">
            {bullyingReports.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-rose-900">{b.reportCode}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(b.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="font-bold text-slate-800">
                  Hình thức: {b.incidentType} • Đối tượng: {b.victimType}
                </div>
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                  {b.description}
                </p>
                {b.location && (
                  <div className="text-slate-500 text-[11px]">
                    Địa điểm: <strong>{b.location}</strong> • Thời gian: <strong>{b.incidentDate}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: RESOURCES CREATION */}
      {activeTab === 'RESOURCES' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Đăng Bài Viết & Tình Huống Kỹ Năng Mới
            </h2>
            <p className="text-xs text-slate-500">
              Bài viết sẽ xuất hiện trong Thư Viện Kỹ Năng Sống dành cho học sinh.
            </p>
          </div>

          {resourceSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold">
              Đã xuất bản bài viết thành công vào Thư viện học liệu!
            </div>
          )}

          <form onSubmit={handleCreateResource} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề bài viết:</label>
                <input
                  type="text"
                  required
                  value={newResourceTitle}
                  onChange={(e) => setNewResourceTitle(e.target.value)}
                  placeholder="Ví dụ: Kỹ năng quản lý thời gian thi học kỳ..."
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Danh mục:</label>
                <select
                  value={newResourceCategory}
                  onChange={(e) => setNewResourceCategory(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200 bg-slate-50"
                >
                  <option value="Áp lực học tập">Áp lực học tập</option>
                  <option value="Kỹ năng cảm xúc">Kỹ năng cảm xúc</option>
                  <option value="Phòng chống bắt nạt">Phòng chống bắt nạt</option>
                  <option value="Dành cho phụ huynh">Dành cho phụ huynh</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tóm tắt ngắn gọn:</label>
              <input
                type="text"
                value={newResourceSummary}
                onChange={(e) => setNewResourceSummary(e.target.value)}
                placeholder="Lời tóm tắt 1-2 câu truyền cảm hứng..."
                className="w-full text-xs p-3 rounded-2xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung chi tiết:</label>
              <textarea
                required
                rows={6}
                value={newResourceContent}
                onChange={(e) => setNewResourceContent(e.target.value)}
                placeholder="Viết nội dung bài học, các bước thực hiện rõ ràng..."
                className="w-full text-xs p-4 rounded-2xl border border-slate-200 bg-slate-50"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Xuất bản bài học
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: AUDIT LOGS (ADMIN ONLY) */}
      {activeTab === 'AUDIT' && user.role === 'ADMIN' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Nhật Ký Kiểm Toán Hệ Thống (Audit Logs)
          </h2>
          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-sky-800">{log.actionType}</span>
                  <span className="text-slate-500 ml-2">[{log.targetResource}]</span>
                  <span className="text-slate-700 ml-2">{log.details}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {new Date(log.createdAt).toLocaleString('vi-VN')} • {log.username}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REQUEST DETAIL MODAL (COUNSELOR CLINICAL MANAGEMENT) */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-black text-sky-700">
                    {selectedRequest.requestCode}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                      STATUS_LABELS[selectedRequest.status]?.color
                    }`}
                  >
                    {STATUS_LABELS[selectedRequest.status]?.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Chủ đề: <strong>{TOPIC_LABELS[selectedRequest.topic]}</strong> • Học sinh:{' '}
                  <strong>{selectedRequest.studentAlias}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Student Shared Content */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Nội dung học sinh gửi:
                </span>
                <p className="whitespace-pre-line text-slate-800 leading-relaxed font-sans">
                  {selectedRequest.content}
                </p>
              </div>

              {/* Status Update Action Bar */}
              <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-2xl space-y-3">
                <span className="font-bold text-sky-950 uppercase tracking-wider text-[11px] block">
                  Cập nhật trạng thái xử lý:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'CLASSIFYING',
                    'ASSIGNED',
                    'IN_PROGRESS',
                    'WAITING_FEEDBACK',
                    'RESOLVED',
                    'CLOSED',
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleUpdateRequestStatus(s as RequestStatus)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                        selectedRequest.status === s
                          ? 'bg-slate-900 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {STATUS_LABELS[s as RequestStatus]?.label}
                    </button>
                  ))}
                </div>

                {/* Send outward message to student */}
                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-sky-900 mb-1">
                    Gửi phản hồi cho học sinh (Học sinh sẽ đọc được qua mã tra cứu):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={counselorReply}
                      onChange={(e) => setCounselorReply(e.target.value)}
                      placeholder="Nhập lời nhắn gửi đến học sinh..."
                      className="flex-1 text-xs p-2.5 rounded-xl border border-sky-200 bg-white"
                    />
                    <button
                      onClick={() => handleUpdateRequestStatus(selectedRequest.status)}
                      disabled={!counselorReply.trim()}
                      className="px-4 py-2 bg-sky-600 disabled:opacity-50 text-white font-bold rounded-xl"
                    >
                      Gửi tin
                    </button>
                  </div>
                </div>
              </div>

              {/* Strict Private Clinical Notes */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-rose-600" />
                    <span>Ghi chú chuyên môn nội bộ (BẢO MẬT TUYỆT ĐỐI)</span>
                  </h4>
                  <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                    Học sinh không thể xem
                  </span>
                </div>

                <div className="space-y-2.5">
                  {internalNotes.map((n) => (
                    <div key={n.id} className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                      <div className="flex justify-between font-bold text-amber-950 text-[11px]">
                        <span>{n.authorName}</span>
                        <span className="font-normal text-slate-400">
                          {new Date(n.createdAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                      {n.actionTaken && (
                        <div className="text-slate-600">
                          <strong>Hành động đã làm:</strong> {n.actionTaken}
                        </div>
                      )}
                      <p className="text-slate-800 leading-relaxed font-sans">{n.noteContent}</p>
                    </div>
                  ))}
                </div>

                {/* Add new clinical note */}
                <form onSubmit={handleAddInternalNote} className="space-y-2 pt-2">
                  <input
                    type="text"
                    value={newActionTaken}
                    onChange={(e) => setNewActionTaken(e.target.value)}
                    placeholder="Các bước hỗ trợ đã thực hiện (VD: Đã gặp riêng giờ ra chơi, trao đổi cùng GVCN)..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                  <textarea
                    rows={2}
                    value={newInternalNote}
                    onChange={(e) => setNewInternalNote(e.target.value)}
                    placeholder="Ghi nhận đánh giá chuyên môn nghiệp vụ tâm lý..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50"
                  />
                  <button
                    type="submit"
                    disabled={!newInternalNote.trim()}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors"
                  >
                    Lưu ghi chú nghiệp vụ
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
