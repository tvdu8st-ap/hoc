function Home({ onOpenEmergency }: { onOpenEmergency: () => void }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-center">
      {/* Tiêu đề chính */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          Lắng nghe & Đồng hành <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">học đường</span>
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Không gian an toàn, ấm áp và thấu cảm dành riêng cho các bạn học sinh. Nơi mọi băn khoăn về áp lực thi cử, tình bạn, cảm xúc cá nhân hay bạo lực học đường đều được lắng nghe và bảo mật trọn vẹn.
        </p>
      </div>

      {/* 3 khối chức năng nổi bật (Nút lớn màu sắc) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Link to="/chia-se" className="p-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 flex flex-col items-center text-center">
          <div className="bg-white/20 p-4 rounded-2xl mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-lg mb-2">Góc Chia Sẻ Tâm Tư</h3>
          <p className="text-xs text-indigo-100">Tâm sự ẩn danh, trải lòng & tìm sự đồng cảm</p>
        </Link>

        <Link to="/tro-ly-ai" className="p-8 bg-sky-500 hover:bg-sky-600 text-white rounded-3xl shadow-xl shadow-sky-200 transition-all transform hover:-translate-y-1 flex flex-col items-center text-center">
          <div className="bg-white/20 p-4 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-lg mb-2">Trò Chuyện Cùng Trợ Lý AI</h3>
          <p className="text-xs text-sky-100">Tư vấn 24/7, xoa dịu lo âu & giải tỏa áp lực</p>
        </Link>

        <button onClick={onOpenEmergency} className="p-8 bg-rose-600 hover:bg-rose-700 text-white rounded-3xl shadow-xl shadow-rose-200 transition-all transform hover:-translate-y-1 flex flex-col items-center text-center w-full">
          <div className="bg-white/20 p-4 rounded-2xl mb-4">
            <PhoneCall className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-lg mb-2">SOS Khẩn Cấp 111</h3>
          <p className="text-xs text-rose-100">Tổng đài Quốc gia Bảo vệ Trẻ em miễn phí</p>
        </button>
      </div>

      {/* 4 thẻ tính năng phụ bên dưới */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        <Link to="/cam-xuc" className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition group">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Smile className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900 mb-1">Nhật Ký Cảm Xúc</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Điểm danh tâm trạng mỗi ngày qua các biểu tượng cảm xúc, theo dõi biểu đồ tâm lý học đường.</p>
        </Link>

        <Link to="/chong-bat-nat" className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition group">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Shield className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900 mb-1">Chống Bạo Lực Học Đường</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Gửi báo cáo bạo lực học đường an toàn, ẩn danh 100%, bảo vệ học sinh ngay lập tức.</p>
        </Link>

        <Link to="/dang-ky-tu-van" className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition group">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900 mb-1">Đặt Lịch Chuyên Gia</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Gặp thầy cô tư vấn tâm lý chuyên sâu để được hỗ trợ kịp thời và bảo mật thông tin.</p>
        </Link>

        <Link to="/thu-vien" className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition group">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <BookOpen className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900 mb-1">Thư Viện Kỹ Năng</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Kho cẩm nang kiểm soát lo âu, bí quyết giải tỏa áp lực thi cử và xây dựng tình bạn lành mạnh.</p>
        </Link>
      </div>
    </div>
  );
}
