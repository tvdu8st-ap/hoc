import React from 'react';
import { Link } from 'react-router-dom';
import { useAgeMode } from '../context/AgeModeContext';
import {
  Heart,
  Smile,
  Bot,
  MessageSquare,
  Shield,
  BookOpen,
  Calendar,
  Sparkles,
  PhoneCall,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Sun,
  Compass,
  CheckCircle2,
} from 'lucide-react';

interface HomeProps {
  onOpenEmergency: () => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenEmergency }) => {
  const { isPrimary, mode } = useAgeMode();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 bg-gradient-to-b from-sky-50/70 via-indigo-50/30 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 shadow-xs text-xs font-bold text-sky-800">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>
                  {isPrimary
                    ? 'Chào mừng các bạn nhỏ đến với Ngôi Nhà Cảm Xúc!'
                    : 'Không gian tư vấn tâm lý học đường an toàn & bảo mật'}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                {isPrimary ? (
                  <>
                    Mỗi nụ cười của em{' '}
                    <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                      đều là một món quà!
                    </span>
                  </>
                ) : (
                  <>
                    Mỗi cảm xúc đều đáng được lắng nghe,{' '}
                    <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      cùng em trưởng thành.
                    </span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {isPrimary
                  ? 'Nếu hôm nay em có điều gì buồn bã, tức giận hay bối rối, hãy ghé thăm Góc Lắng Nghe. Thầy cô và Bạn Đồng Hành luôn sẵn lòng lắng nghe và ôm em vào lòng!'
                  : 'Nơi giải tỏa áp lực học tập, gỡ rối mâu thuẫn bạn bè, khám phá tâm sinh lý tuổi dậy thì và chia sẻ bí mật hoàn toàn bảo mật cùng các chuyên gia tâm lý học đường.'}
              </p>

              {/* Call to actions */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/chia-se"
                  className="px-6 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-200 transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isPrimary ? 'Gửi lời nhắn cho Thầy Cô' : 'Gửi phiếu chia sẻ bảo mật'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/tro-ly-ai"
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs transition-all flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-purple-600" />
                  <span>Trò chuyện cùng AI Bạn Đồng Hành</span>
                </Link>

                {isPrimary && (
                  <button
                    onClick={onOpenEmergency}
                    className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-sm shadow-md shadow-amber-200 transition-all flex items-center gap-2"
                  >
                    <span>🧸</span>
                    <span>Em cần người lớn giúp đỡ!</span>
                  </button>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Bảo mật danh tính 100%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-sky-600" />
                  <span>Chuyên viên tâm lý trường học</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Lắng nghe không phán xét</span>
                </div>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                {/* Floating pill */}
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5" />
                  <span>Hôm nay bạn cảm thấy thế nào?</span>
                </div>

                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {isPrimary ? 'Trạm Dừng Cảm Xúc Nhanh' : 'Check-in Cảm Xúc Mỗi Ngày'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Chỉ mất 10 giây để nhận biết cảm xúc và nhận lời khuyên tích cực
                    </p>
                  </div>

                  {/* Quick mood choices */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {[
                      { icon: '😊', label: 'Vui vẻ', color: 'hover:bg-amber-50 border-amber-200' },
                      { icon: '😌', label: 'Bình yên', color: 'hover:bg-emerald-50 border-emerald-200' },
                      { icon: '😰', label: 'Lo lắng', color: 'hover:bg-sky-50 border-sky-200' },
                      { icon: '😢', label: 'Buồn bã', color: 'hover:bg-indigo-50 border-indigo-200' },
                    ].map((m) => (
                      <Link
                        key={m.label}
                        to="/cam-xuc"
                        className={`flex flex-col items-center p-3 rounded-2xl border ${m.color} bg-slate-50/50 transition-all hover:scale-105 text-center`}
                      >
                        <span className="text-2xl mb-1">{m.icon}</span>
                        <span className="text-[11px] font-semibold text-slate-700">{m.label}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Daily encouraging quote */}
                  <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 text-xs text-slate-700 space-y-1">
                    <p className="font-bold text-sky-900">💡 Lời nhắn từ Thầy Cô hôm nay:</p>
                    <p className="italic text-slate-600">
                      {isPrimary
                        ? '"Đừng ngần ngại nói ra khi em thấy mệt. Một cái ôm ấm áp luôn chờ em ở trường!"'
                        : '"Điểm số chỉ đo lường kiến thức của một bài thi, không đo lường lòng dũng cảm và giá trị của em."'}
                    </p>
                  </div>

                  {/* Quick action button to appointments */}
                  <Link
                    to="/dang-ky-tu-van"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-sky-400" />
                    <span>Đặt lịch trò chuyện riêng tại Phòng 204</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Các Không Gian Hỗ Trợ Tại Trường
          </h2>
          <p className="text-sm text-slate-600">
            Được thiết kế thân thiện, tiện ích và bảo vệ quyền riêng tư cho học sinh
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Góc cảm xúc */}
          <Link
            to="/cam-xuc"
            className="group p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Góc Cảm Xúc & Bài Tập Hít Thở
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Nhận biết các cung bậc cảm xúc, thực hành bài tập "Hộp Hơi Thở 4-4" hạ hỏa cơn giận và thổi bay lo âu trước giờ kiểm tra.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-amber-600">
              <span>Khám phá ngay</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Bạn Đồng Hành AI */}
          <Link
            to="/tro-ly-ai"
            className="group p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between"
          >
            <div className="absolute top-4 right-4 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Gemini 3.8 Flash
            </div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Trợ Lý AI "Bạn Đồng Hành"
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Trò chuyện 24/7 giải tỏa thắc mắc về phương pháp học tập, tâm lý bạn bè và kỹ năng giao tiếp với ngôn ngữ dịu dàng, an toàn.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-purple-600">
              <span>Bắt đầu trò chuyện</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Góc chia sẻ */}
          <Link
            to="/chia-se"
            className="group p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                Góc Chia Sẻ & Hòm Thư Bí Mật
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Gửi yêu cầu tư vấn với mã tra cứu ngẫu nhiên (GLN-XXXXXX). Trao đổi 2 chiều bảo mật mà không sợ lộ danh tính.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-sky-600">
              <span>Gửi tâm sự hoặc tra cứu</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Phòng chống bắt nạt */}
          <Link
            to="/chong-bat-nat"
            className="group p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                Phòng Chống Bắt Nạt Học Đường
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Nhận diện bắt nạt thể chất, lời nói, mạng internet. Gửi báo cáo khẩn cấp để thầy cô can thiệp ngay bảo vệ học sinh.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-rose-600">
              <span>Tìm hiểu & Báo cáo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 5: Thư viện kỹ năng */}
          <Link
            to="/thu-vien"
            className="group p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Thư Viện Kỹ Năng Sống
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Kho truyện tình huống, hướng dẫn quản lý thời gian, ứng phó stress phòng thi và cẩm nang tâm sinh lý tuổi dậy thì.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-emerald-600">
              <span>Đọc bài viết hay</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 6: Đăng ký tư vấn */}
          <Link
            to="/dang-ky-tu-van"
            className="group p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Đăng Ký Tư Vấn Trực Tiếp
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Chọn giờ ra chơi hoặc sau giờ học, đăng ký gặp thầy cô tư vấn tại Phòng 204 hoặc phòng trao đổi trực tuyến bảo mật.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-indigo-600">
              <span>Xem lịch trống</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Counselor Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-sky-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold tracking-wider uppercase text-sky-300">
                Đội Ngũ Tư Vấn Học Đường
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Thầy Cô Luôn Lắng Nghe Và Thấu Hiểu Em
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Được đào tạo chuyên sâu về tâm lý phát triển lứa tuổi học sinh, thầy cô luôn giữ kín mọi điều em kể và là điểm tựa an toàn nhất của em tại trường.
              </p>
              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Phòng 204 - Mở cửa đón học sinh các ngày trong tuần</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Không lưu trữ hồ sơ công khai làm ảnh hưởng học sinh</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Counselor 1 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-lg mb-3">
                  TA
                </div>
                <h4 className="font-bold text-white text-base">ThS. Nguyễn Tuấn Anh</h4>
                <p className="text-xs text-sky-300">Chuyên viên Tâm lý Học đường</p>
                <p className="text-xs text-slate-300 mt-2">
                  Hơn 10 năm kinh nghiệm đồng hành cùng học sinh THCS trong việc vượt qua stress học tập, tuổi dậy thì và định hướng bản thân.
                </p>
              </div>

              {/* Counselor 2 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-lg mb-3">
                  TT
                </div>
                <h4 className="font-bold text-white text-base">Cô Nguyễn Thị Thùy Trang</h4>
                <p className="text-xs text-amber-300">Tư vấn Tâm lý Lứa tuổi Tiểu học</p>
                <p className="text-xs text-slate-300 mt-2">
                  Chuyên môn về tâm lý cảm xúc trẻ em, liệu pháp trò chơi và kết nối giữa gia đình - nhà trường một cách nhẹ nhàng, ấm áp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-600 text-white rounded-2xl shrink-0">
              <PhoneCall className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Em hoặc bạn bè đang gặp nguy hiểm hay bị đe dọa?
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                Đừng giữ trong lòng một mình! Hãy gọi ngay Tổng đài Quốc gia Bảo vệ Trẻ em <strong>111</strong> (miễn phí 24/7) hoặc bấm nút trợ giúp khẩn cấp bên dưới.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenEmergency}
            className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-rose-200 transition-all shrink-0"
          >
            Mở Kênh Trợ Giúp Khẩn Cấp
          </button>
        </div>
      </section>
    </div>
  );
};
