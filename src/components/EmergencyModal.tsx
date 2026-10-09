import React from 'react';
import { Phone, AlertCircle, Heart, X, ShieldAlert, MapPin, UserCheck } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  ageMode: 'PRIMARY' | 'SECONDARY' | 'GENERAL';
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, ageMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-rose-200">
        {/* Header with emergency alert styling */}
        <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-red-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex p-3 rounded-2xl bg-white/20 backdrop-blur-xs mb-2">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {ageMode === 'PRIMARY' ? 'Thầy Cô Luôn Ở Bên Em!' : 'Hỗ Trợ Khẩn Cấp - An Toàn Cho Em'}
          </h2>
          <p className="text-rose-100 text-sm mt-1 max-w-md mx-auto">
            {ageMode === 'PRIMARY'
              ? 'Em đừng sợ nhé, em không hề có lỗi và người lớn luôn sẵn lòng bảo vệ em.'
              : 'Em không phải đối mặt với khó khăn này một mình. Hãy kết nối ngay với người lớn tin cậy.'}
          </p>
        </div>

        {/* Content & Action list */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Main national hotline */}
          <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200 flex items-start gap-4">
            <div className="p-3 bg-rose-600 text-white rounded-2xl shrink-0 shadow-md">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                  Tổng Đài Quốc Gia
                </span>
                <span className="text-xs bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full font-medium">
                  Miễn phí 24/7
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">Số 111 – Bảo Vệ Trẻ Em</h3>
              <p className="text-sm text-slate-600 mt-1">
                Tiếp nhận mọi cuộc gọi khi em cảm thấy bị đe dọa, bị bắt nạt, bị bạo lực hoặc gặp nguy hiểm.
              </p>
              <div className="mt-3">
                <a
                  href="tel:111"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
                >
                  <Phone className="w-4 h-4" /> Bấm gọi ngay: 111
                </a>
              </div>
            </div>
          </div>

          {/* School Counseling Room */}
          <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200 flex items-start gap-4">
            <div className="p-3 bg-sky-600 text-white rounded-2xl shrink-0 shadow-md">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                Tại Trường Học
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Phòng Tư Vấn Tâm Lý Học Đường (Phòng 204 - Tầng 2)
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Thầy Tuấn Anh (Chuyên viên tâm lý) và Cô Thùy Trang (Tư vấn tiểu học) luôn sẵn sàng mở cửa đón em bất kỳ giờ ra chơi nào.
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs font-medium text-sky-800 bg-sky-100/60 p-2 rounded-lg">
                <UserCheck className="w-4 h-4 shrink-0 text-sky-600" />
                <span>Tuyệt đối giữ bí mật nội dung chia sẻ, không phán xét.</span>
              </div>
            </div>
          </div>

          {/* Other hotlines grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 font-medium">Cấp Cứu Y Tế</span>
              <p className="text-lg font-bold text-slate-900 mt-0.5">115</p>
              <p className="text-xs text-slate-500">Khi cần chăm sóc sức khỏe gấp</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 font-medium">Cảnh Sát / An Ninh</span>
              <p className="text-lg font-bold text-slate-900 mt-0.5">113</p>
              <p className="text-xs text-slate-500">Khi bị đe dọa an toàn thân thể</p>
            </div>
          </div>

          {/* Calming steps */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
            <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm mb-1">
              <Heart className="w-4 h-4 text-amber-600" />
              <span>3 Điều Em Cần Nhớ Ngay Lúc Này:</span>
            </div>
            <ul className="text-xs text-amber-900/90 space-y-1.5 list-disc list-inside">
              <li>Em không có lỗi khi gặp phải chuyện không vui hoặc bị người khác đối xử tệ.</li>
              <li>Em hãy hít một hơi thật sâu, thở ra từ từ để cơ thể bớt căng thẳng.</li>
              <li>Hãy bước đến gần một người lớn đáng tin cậy gần nhất (cô giáo, bác bảo vệ, cha mẹ).</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Em đã hiểu, cảm ơn thầy cô
          </button>
        </div>
      </div>
    </div>
  );
};
