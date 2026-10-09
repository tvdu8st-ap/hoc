import React, { useState } from 'react';
import { useAgeMode } from '../context/AgeModeContext';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Send,
  Eye,
  CheckCircle2,
  Phone,
  Lock,
  UserX,
  MessageSquareWarning,
  Globe,
  Share2,
} from 'lucide-react';

interface AntiBullyingProps {
  onOpenEmergency: () => void;
}

export const AntiBullying: React.FC<AntiBullyingProps> = ({ onOpenEmergency }) => {
  const { isPrimary, mode } = useAgeMode();

  // Report form state
  const [victimType, setVictimType] = useState('Bản thân em bị');
  const [incidentType, setIncidentType] = useState('Lăng mạ, chê bai ngoại hình hoặc xúc phạm');
  const [location, setLocation] = useState('Hành lang lớp học hoặc giờ ra chơi');
  const [incidentDate, setIncidentDate] = useState('');
  const [description, setDescription] = useState('');
  const [safeContact, setSafeContact] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportSuccessCode, setReportSuccessCode] = useState<string | null>(null);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bullying', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gradeLevel: mode,
          victimType,
          incidentType,
          location,
          incidentDate,
          description: description.trim(),
          safeContact,
          isAnonymous,
        }),
      });
      const data = await res.json();
      if (data.success && data.reportCode) {
        setReportSuccessCode(data.reportCode);
        setDescription('');
      } else {
        alert(data.message || 'Có lỗi xảy ra.');
      }
    } catch {
      alert('Không thể kết nối đến máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-50 text-rose-800 rounded-full text-xs font-bold border border-rose-200">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Trường Học An Toàn – Không Bạo Lực</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Phòng Chống Bắt Nạt & Bạo Lực Học Đường
        </h1>
        <p className="text-sm text-slate-600">
          Mỗi học sinh đều có quyền được an toàn khi đến trường. Im lặng trước bắt nạt là dung túng cho cái xấu – Hãy lên tiếng để thầy cô bảo vệ em!
        </p>
      </div>

      {/* 4 Forms of Bullying */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            4 Hình Thức Bắt Nạt Cần Nhận Biết Ngay:
          </h2>
          <span className="text-xs text-slate-500">Đừng để bị đánh lừa là "chỉ đùa vui"</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              👊
            </div>
            <h3 className="font-bold text-sm text-slate-900">1. Bắt nạt thể chất</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Đánh, xô đẩy, ngáng chân, giật cặp sách, làm hỏng đồ dùng học tập hoặc ép buộc thể lực.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-amber-100 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              🗣️
            </div>
            <h3 className="font-bold text-sm text-slate-900">2. Bắt nạt bằng lời nói</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Đặt biệt danh xúc phạm, châm chọc ngoại hình, chế giễu gia cảnh, đe dọa hoặc tung tin thất thiệt.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              🚫
            </div>
            <h3 className="font-bold text-sm text-slate-900">3. Cô lập xã hội</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cố tình xúi giục cả lớp tẩy chay, không cho ngồi cùng, không cho tham gia nhóm học tập hoặc vui chơi.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-sky-100 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              💻
            </div>
            <h3 className="font-bold text-sm text-slate-900">4. Bắt nạt không gian mạng</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Đăng ảnh dìm hàng lên Facebook/TikTok, lập nhóm chat kín bêu rếu, gửi tin nhắn xúc phạm nặc danh.
            </p>
          </div>
        </div>
      </div>

      {/* 3 KHÔNG - 3 NÊN */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Bộ Quy Tắc Vàng
          </span>
          <h2 className="text-2xl font-extrabold text-white">
            Quy Tắc "3 Không – 3 Nên" Khi Đối Diện Bắt Nạt
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* 3 KHÔNG */}
          <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800/60 space-y-3">
            <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">
                ✕
              </span>
              <span>3 ĐIỀU TUYỆT ĐỐI "KHÔNG":</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>
                  <strong>KHÔNG tự trách bản thân:</strong> Em không làm gì sai. Bắt nạt là hành vi sai trái của kẻ bắt nạt.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>
                  <strong>KHÔNG trả thù bằng bạo lực:</strong> Đánh lại hoặc chửi bới sẽ khiến xung đột leo thang nguy hiểm.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>
                  <strong>KHÔNG im lặng chịu đựng:</strong> Càng im lặng thì kẻ bắt nạt càng lấn tới.
                </span>
              </li>
            </ul>
          </div>

          {/* 3 NÊN */}
          <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-3">
            <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                ✓
              </span>
              <span>3 ĐIỀU EM "NÊN LÀM NGAY":</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>NÊN giữ bình tĩnh & rời đi:</strong> Bước nhanh tới khu vực đông người hoặc phòng giáo viên.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>NÊN lưu lại bằng chứng:</strong> Chụp ảnh màn hình tin nhắn, ghi nhớ thời gian và người chứng kiến.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>NÊN báo ngay cho người lớn:</strong> Gửi báo cáo bên dưới hoặc gọi 111 để được bảo vệ kịp thời.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Incident Intake Report Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Kênh tiếp nhận sự việc khẩn cấp</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Gửi Báo Cáo Sự Việc Bắt Nạt Học Đường
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Báo cáo được chuyển thẳng tới Ban Giám Thị và Tổ Tư Vấn Học Đường để xử lý bảo mật.
          </p>
        </div>

        {reportSuccessCode ? (
          <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-200 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Báo Cáo Đã Được Tiếp Nhận Ưu Tiên!
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Mã báo cáo của bạn là:{' '}
              <strong className="font-mono text-emerald-800 text-base">{reportSuccessCode}</strong>
              . Ban An Toàn trường học sẽ xác minh thận trọng và bảo vệ tuyệt đối danh tính của người báo cáo.
            </p>
            <button
              onClick={() => setReportSuccessCode(null)}
              className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
            >
              Gửi thêm báo cáo khác
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitReport} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Người báo cáo là:
                </label>
                <select
                  value={victimType}
                  onChange={(e) => setVictimType(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50"
                >
                  <option value="Bản thân em bị">Bản thân em là người bị bắt nạt</option>
                  <option value="Em chứng kiến bạn khác bị">Em chứng kiến bạn khác đang bị bắt nạt</option>
                  <option value="Báo cáo nặc danh từ học sinh">Báo cáo nặc danh giúp bạn bè</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hình thức sự việc xảy ra:
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50"
                >
                  <option value="Lăng mạ, chê bai ngoại hình hoặc xúc phạm">
                    Lăng mạ, chê bai ngoại hình, châm chọc xúc phạm
                  </option>
                  <option value="Bạo lực thể xác, đánh đập, chặn đường">
                    Bạo lực thể xác, đánh đập, chặn đường
                  </option>
                  <option value="Cô lập, ép cả lớp tẩy chay">Cô lập, ép cả lớp tẩy chay</option>
                  <option value="Bắt nạt qua mạng, lập nhóm bêu rếu">
                    Bắt nạt qua mạng, đăng ảnh bêu rếu
                  </option>
                  <option value="Tống tiền, ép nộp tiền hoặc đồ ăn">
                    Tống tiền, trấn lột đồ dùng học tập
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa điểm xảy ra sự việc (Nếu biết):
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ví dụ: Cầu thang tầng 3, Căng tin trường, Nhà xe, Trên Facebook..."
                  className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Thời gian diễn ra (Hoặc khoảng thời gian):
                </label>
                <input
                  type="text"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  placeholder="Ví dụ: Giờ ra chơi hôm qua, liên tục trong tuần này..."
                  className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mô tả chi tiết sự việc:
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả sự việc đã diễn ra như thế nào, ai liên quan, hậu quả ra sao để thầy cô có đầy đủ thông tin xử lý..."
                className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 accent-rose-600 rounded"
                />
                <span className="text-xs font-bold text-slate-800">
                  Ẩn danh hoàn toàn (Không lưu thông tin cá nhân của em)
                </span>
              </label>

              {!isAnonymous && (
                <input
                  type="text"
                  value={safeContact}
                  onChange={(e) => setSafeContact(e.target.value)}
                  placeholder="Số điện thoại hoặc email an toàn..."
                  className="text-xs p-2 rounded-xl border border-slate-300 bg-white"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !description.trim()}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang gửi khẩn cấp...' : 'Gửi báo cáo sự việc này ngay'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
