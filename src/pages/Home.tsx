/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, MessageSquare, Shield, BookOpen, Calendar, PhoneCall, ArrowRight } from 'lucide-react';

interface HomeProps {
  onOpenEmergency: () => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenEmergency }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Không gian an toàn & bảo mật học đường
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Lắng nghe tâm tư, đồng hành cùng tương lai bạn
          </h1>
          <p className="text-indigo-100 text-sm md:text-base leading-relaxed">
            Nơi học sinh Tiểu học và THCS có thể chia sẻ cảm xúc, trò chuyện cùng trợ lý AI, tìm kiếm cẩm nang kỹ năng hoặc đặt lịch tư vấn bảo mật cùng chuyên gia tâm lý nhà trường.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link 
              to="/chia-se" 
              className="bg-white text-indigo-900 font-bold px-6 py-3 rounded-2xl shadow-lg hover:bg-indigo-50 transition flex items-center gap-2"
            >
              Góc Chia Sẻ Tâm Tư <ArrowRight className="w-4 h-4" />
            </Link>
            <button 
              onClick={onOpenEmergency}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg transition flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" /> SOS Khẩn Cấp 111
            </button>
          </div>
        </div>
      </div>

      {/* Grid Tính Năng Nổi Bật */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800">Các Góc Hỗ Trợ Dành Cho Bạn</h2>
          <p className="text-slate-500 text-sm mt-1">Lựa chọn chuyên mục phù hợp để bắt đầu hành trình chăm sóc sức khỏe tinh thần.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Góc Cảm Xúc */}
          <Link to="/cam-xuc" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition group">
            <div className="bg-amber-100 text-amber-700 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <span className="text-2xl">😊</span>
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-1">Góc Cảm Xúc</h3>
            <p className="text-xs text-slate-500">Ghi nhận và thấu hiểu trạng thái cảm xúc mỗi ngày của bạn với những lời khuyên hữu ích.</p>
          </Link>

          {/* Trợ Lý AI */}
          <Link to="/tro-ly-ai" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition group">
            <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-1">Trợ Lý AI Lắng Nghe</h3>
            <p className="text-xs text-slate-500">Trò chuyện và tâm sự 24/7 cùng chuyên gia ảo thông minh, luôn sẵn sàng lắng nghe mọi lúc.</p>
          </Link>

          {/* Chống Bạo Lực Học Đường */}
          <Link to="/chong-bat-nat" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition group">
            <div className="bg-rose-100 text-rose-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-1">Phòng Chống Bạo Lực</h3>
            <p className="text-xs text-slate-500">Trang bị kiến thức nhận diện, phòng tránh và kênh báo cáo an toàn trước các hành vi bắt nạt.</p>
          </Link>

          {/* Thư Viện */}
          <Link to="/thu-vien" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition group">
            <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-1">Thư Viện Cẩm Nang</h3>
            <p className="text-xs text-slate-500">Kho tài liệu, kỹ năng sống, bí quyết học tập và chăm sóc sức khỏe tinh thần từ nhà trường.</p>
          </Link>

          {/* Đặt Lịch Tư Vấn */}
          <Link to="/dang-ky-tu-van" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition group">
            <div className="bg-violet-100 text-violet-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-1">Đặt Lịch Tư Vấn</h3>
            <p className="text-xs text-slate-500">Đăng ký lịch hẹn bảo mật trực tiếp với thầy cô và chuyên gia tâm lý học đường.</p>
          </Link>

          {/* Góc Chia Sẻ */}
          <Link to="/chia-se" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition group">
            <div className="bg-sky-100 text-sky-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-1">Góc Chia Sẻ</h3>
            <p className="text-xs text-slate-500">Nơi học sinh gửi gắm những câu chuyện đẹp, lời động viên và đồng hành cùng nhau mỗi ngày.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
