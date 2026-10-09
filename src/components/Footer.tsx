import React from 'react';
import { Heart, ShieldCheck, Phone, MapPin, Mail, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Commitment */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-white/20" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                GÓC LẮNG NGHE
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cổng thông tin tư vấn tâm lý học đường, hỗ trợ cảm xúc và chăm sóc sức khỏe tinh thần dành cho học sinh Tiểu học và THCS.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Cam kết bảo mật học đường</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Mọi thông tin tâm sự đều được bảo vệ nghiêm ngặt theo Luật Trẻ em và Quy định an toàn trường học.
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Không Gian Hỗ Trợ
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/cam-xuc" className="hover:text-sky-400 transition-colors">
                  Góc cảm xúc & Bài tập hít thở
                </Link>
              </li>
              <li>
                <Link to="/tro-ly-ai" className="hover:text-sky-400 transition-colors">
                  Trò chuyện cùng Bạn Đồng Hành (AI)
                </Link>
              </li>
              <li>
                <Link to="/chia-se" className="hover:text-sky-400 transition-colors">
                  Gửi phiếu tâm sự bảo mật
                </Link>
              </li>
              <li>
                <Link to="/chong-bat-nat" className="hover:text-sky-400 transition-colors">
                  Kênh báo cáo phòng chống bắt nạt
                </Link>
              </li>
              <li>
                <Link to="/dang-ky-tu-van" className="hover:text-sky-400 transition-colors">
                  Đặt lịch gặp chuyên viên tư vấn
                </Link>
              </li>
              <li>
                <Link to="/thu-vien" className="hover:text-sky-400 transition-colors">
                  Thư viện kỹ năng sống & Tuổi dậy thì
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Emergency Contacts */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Kênh Cứu Hộ Khẩn Cấp
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl">
                <div className="flex items-center justify-between text-rose-400 font-bold">
                  <span>Tổng đài Quốc gia: 111</span>
                  <span className="text-[10px] bg-rose-900/60 text-rose-300 px-2 py-0.5 rounded-full">
                    24/7 Miễn phí
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Bảo vệ trẻ em khỏi bạo lực, bóc lột và xâm hại.
                </p>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Cấp cứu y tế: <strong>115</strong> | Công an: <strong>113</strong></span>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Phòng tư vấn mở cửa: 7h30 - 17h00 (Thứ 2 - Thứ 6)</span>
              </div>
            </div>
          </div>

          {/* Col 4: Location & Guidance */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Địa Chỉ Tại Trường
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Phòng Tư vấn Tâm lý Học đường (P.204 - Tầng 2, Dãy nhà Hiệu bộ)</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>tuvanhocduong@truong.edu.vn</span>
              </div>
              <div className="pt-2 text-slate-500 text-[11px] border-t border-slate-800">
                Luôn có giáo viên tâm lý túc trực vào giờ ra chơi và sau giờ học để đồng hành cùng các em.
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Góc Lắng Nghe - Cùng Em Trưởng Thành. Phát triển vì sự an toàn và hạnh phúc của học sinh.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Tiêu chuẩn Bảo vệ Trẻ em</span>
            <span>•</span>
            <span>Chính sách Quyền riêng tư</span>
            <span>•</span>
            <span>Không thương mại hóa</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
