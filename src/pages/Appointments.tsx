import React, { useState, useEffect } from 'react';
import { useAgeMode } from '../context/AgeModeContext';
import { CounselingAppointment, RequestTopic, TOPIC_LABELS } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Video,
  Phone,
  ShieldCheck,
  Send,
  Info,
} from 'lucide-react';

export const Appointments: React.FC = () => {
  const { isPrimary, mode } = useAgeMode();
  const [appointments, setAppointments] = useState<CounselingAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [counselorId, setCounselorId] = useState(
    isPrimary ? 'usr-counselor-2' : 'usr-counselor-1'
  );
  const [studentName, setStudentName] = useState('');
  const [studentContact, setStudentContact] = useState('');
  const [date, setDate] = useState(() => {
    // Tomorrow as default
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('09:15-09:45');
  const [format, setFormat] = useState<'IN_PERSON' | 'PRIVATE_ONLINE' | 'PHONE_SAFE'>('IN_PERSON');
  const [reasonTopic, setReasonTopic] = useState<RequestTopic>('STUDY_PRESSURE');
  const [privateNotes, setPrivateNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<CounselingAppointment | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const availableSlots = [
    { label: '08:30 - 09:00 (Đầu giờ sáng)', value: '08:30-09:00' },
    { label: '09:15 - 09:45 (Ra chơi tiết 2)', value: '09:15-09:45' },
    { label: '10:05 - 10:35 (Ra chơi tiết 3)', value: '10:05-10:35' },
    { label: '11:45 - 12:15 (Giờ nghỉ trưa)', value: '11:45-12:15' },
    { label: '15:30 - 16:00 (Ra chơi chiều)', value: '15:30-16:00' },
    { label: '16:30 - 17:15 (Sau giờ tan học)', value: '16:30-17:15' },
  ];

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !date) return;

    setErrorMsg(null);
    setIsSubmitting(true);

    const [startTime, endTime] = timeSlot.split('-');

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          counselorId,
          studentName: studentName.trim(),
          studentContact: studentContact.trim(),
          date,
          startTime,
          endTime,
          format,
          reasonTopic,
          privateNotes,
        }),
      });

      const data = await res.json();
      if (data.success && data.appointment) {
        setSuccessBooking(data.appointment);
        fetchAppointments();
      } else {
        setErrorMsg(data.message || 'Không thể đặt lịch. Vui lòng thử lại.');
      }
    } catch {
      setErrorMsg('Lỗi kết nối máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 text-indigo-800 rounded-full text-xs font-bold border border-indigo-200">
          <CalendarIcon className="w-4 h-4 text-indigo-600" />
          <span>Đặt Lịch Tư Vấn Riêng Tư</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Gặp Trực Tiếp Thầy Cô Tư Vấn Tâm Lý
        </h1>
        <p className="text-sm text-slate-600">
          Chọn ngày giờ phù hợp vào giờ ra chơi hoặc sau giờ học. Danh tính và lý do tư vấn hoàn toàn được bảo mật.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Booking Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          {successBooking ? (
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">
                  Đặt Lịch Tư Vấn Thành Công!
                </h3>
                <p className="text-xs text-slate-600">
                  Mã lịch hẹn của em là:{' '}
                  <strong className="font-mono text-indigo-700 text-sm">
                    {successBooking.appointmentCode}
                  </strong>
                </p>
              </div>

              {/* Summary card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Chuyên viên:</span>
                  <span className="font-bold text-slate-800">{successBooking.counselorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Thời gian:</span>
                  <span className="font-bold text-slate-800">
                    {successBooking.startTime} - {successBooking.endTime} ({successBooking.date})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Địa điểm:</span>
                  <span className="font-bold text-slate-800">{successBooking.location}</span>
                </div>
              </div>

              <button
                onClick={() => setSuccessBooking(null)}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Đặt thêm lịch hẹn khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookAppointment} className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">
                  Thông Tin Lịch Hẹn
                </h2>
                <p className="text-xs text-slate-500">
                  Thầy cô chuẩn bị sẵn trà ấm và không gian yên tĩnh chờ đón em.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Select Counselor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chọn Thầy/Cô tư vấn:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCounselorId('usr-counselor-1')}
                    className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
                      counselorId === 'usr-counselor-1'
                        ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className="text-slate-900 font-bold">ThS. Nguyễn Tuấn Anh</div>
                    <div className="text-[11px] text-slate-500">Chuyên viên Tâm lý THCS</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCounselorId('usr-counselor-2')}
                    className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
                      counselorId === 'usr-counselor-2'
                        ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className="text-slate-900 font-bold">Cô Nguyễn Thị Thùy Trang</div>
                    <div className="text-[11px] text-slate-500">Tư vấn Lứa tuổi Tiểu học</div>
                  </button>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ngày hẹn (Thứ 2 - Thứ 6):
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Khung giờ phù hợp:
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50 font-medium"
                  >
                    {availableSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Format & Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hình thức gặp:
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50"
                  >
                    <option value="IN_PERSON">Gặp trực tiếp tại Phòng 204 (Tầng 2)</option>
                    <option value="PRIVATE_ONLINE">Trực tuyến qua kênh bảo mật của trường</option>
                    <option value="PHONE_SAFE">Trao đổi qua điện thoại an toàn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chủ đề em muốn trao đổi:
                  </label>
                  <select
                    value={reasonTopic}
                    onChange={(e) => setReasonTopic(e.target.value as RequestTopic)}
                    className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50"
                  >
                    {Object.entries(TOPIC_LABELS).map(([k, label]) => (
                      <option key={k} value={k}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Student Name & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ tên hoặc Biệt danh của em:
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Ví dụ: Em An (Lớp 7A2)"
                    className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số điện thoại hoặc Email (Tùy chọn):
                  </label>
                  <input
                    type="text"
                    value={studentContact}
                    onChange={(e) => setStudentContact(e.target.value)}
                    placeholder="Để thầy cô gửi lời nhắc lịch"
                    className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi chú riêng trước buổi gặp (Tùy chọn):
                </label>
                <textarea
                  rows={2}
                  value={privateNotes}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                  placeholder="Điều em muốn thầy cô lưu ý trước khi gặp..."
                  className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !studentName.trim()}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang kiểm tra lịch...' : 'Xác nhận đăng ký lịch hẹn'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Location & Public Occupied Slots Schedule */}
        <div className="lg:col-span-5 space-y-6">
          {/* Room 204 location card */}
          <div className="bg-gradient-to-br from-indigo-50 to-sky-50 rounded-3xl p-6 border border-indigo-100 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-800 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Địa Điểm Tư Vấn</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Phòng Tư Vấn Tâm Lý Học Đường (Phòng 204)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nằm ở tầng 2 dãy nhà Ban Giám Hiệu, có lối đi riêng yên tĩnh, không gian tách biệt đảm bảo học sinh vào ra tự nhiên, không bị bạn bè chú ý.
            </p>
            <div className="p-3 bg-white/80 rounded-2xl text-[11px] text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Chống trùng lịch hẹn và bảo vệ sự riêng tư tối đa.</span>
            </div>
          </div>

          {/* Occupied Slots Preview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Lịch Đã Có Người Đặt ({appointments.length})</span>
              </h4>
              <span className="text-[10px] text-slate-400">Đã ẩn danh tính</span>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-800">
                      {apt.date} • {apt.startTime} - {apt.endTime}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Thầy/Cô: {apt.counselorName}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    Đã kín
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Nếu khung giờ em mong muốn đã kín, hãy chọn khung giờ khác hoặc gửi yêu cầu qua Góc Chia Sẻ để thầy cô xếp lịch riêng nhé.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
