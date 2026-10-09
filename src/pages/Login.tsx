import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAgeMode } from '../context/AgeModeContext';
import {
  Lock,
  User as UserIcon,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  LogOut,
  Users,
} from 'lucide-react';

export const Login: React.FC = () => {
  const { user, login, loginWithGoogle, logout, switchDemoUser, demoUsers } = useAuth();
  const { isPrimary } = useAgeMode();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    setError(null);
    const success = await login(username, password || 'demo123');
    setLoading(false);

    if (!success) {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2 max-w-lg mx-auto">
        <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Cổng Đăng Nhập & Phân Quyền
        </h1>
        <p className="text-xs text-slate-600">
          Dành cho Học sinh, Phụ huynh, Giáo viên và Ban Tư vấn Học đường
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Active session card or login form */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {user ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
                <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold text-xl">
                  {user.fullName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{user.fullName}</h3>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-sky-200 text-sky-800">
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tài khoản: <strong>{user.username}</strong>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Quyền hạn trong hệ thống:
                </h4>
                <ul className="text-slate-600 space-y-1 list-disc list-inside text-xs">
                  {user.role === 'STUDENT' && (
                    <>
                      <li>Gửi phiếu tư vấn và theo dõi tiến độ bằng mã bảo mật riêng</li>
                      <li>Trò chuyện không giới hạn cùng Bạn Đồng Hành (AI)</li>
                      <li>Sử dụng các bài tập thư giãn và đọc thư viện kỹ năng sống</li>
                    </>
                  )}
                  {user.role === 'COUNSELOR' && (
                    <>
                      <li>Tiếp nhận, phân loại và phân công phiếu tư vấn học sinh</li>
                      <li>Thêm ghi chú chuyên môn nội bộ bảo mật</li>
                      <li>Quản lý lịch hẹn tư vấn và điều phối can thiệp</li>
                    </>
                  )}
                  {user.role === 'TEACHER' && (
                    <>
                      <li>Xem các yêu cầu tư vấn liên quan đến khối lớp phụ trách</li>
                      <li>Phối hợp theo dõi tình hình tâm lý học sinh được phân công</li>
                    </>
                  )}
                  {user.role === 'ADMIN' && (
                    <>
                      <li>Quản lý người dùng, cấu hình hệ thống và nhật ký kiểm toán</li>
                      <li>Xem báo cáo thống kê tổng hợp của toàn trường</li>
                    </>
                  )}
                  {user.role === 'PARENT' && (
                    <>
                      <li>Đọc cẩm nang hỗ trợ con tuổi dậy thì và liên hệ ban tư vấn</li>
                    </>
                  )}
                </ul>
              </div>

              <button
                onClick={logout}
                className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất tài khoản này</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Nhập Thông Tin Tài Khoản
              </h3>

              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên đăng nhập:
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ví dụ: hocsinh.an hoặc tuvan.tuan"
                  className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mật khẩu:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu demo: demo123"
                  className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{loading ? 'Đang xác thực...' : 'Đăng nhập vào hệ thống'}</span>
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase">
                  hoặc
                </span>
              </div>

              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  const ok = await loginWithGoogle();
                  setLoading(false);
                  if (!ok) setError('Đăng nhập bằng tài khoản Google không thành công.');
                }}
                className="w-full py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Đăng nhập an toàn với Google (OAuth)</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Quick Demo Accounts Selector */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 text-xs font-bold uppercase tracking-wider">
              <Users className="w-4 h-4 text-sky-600" />
              <span>Chuyển Nhanh Tài Khoản Thử Nghiệm</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bấm vào từng vai trò để trải nghiệm phân quyền đầy đủ của hệ thống:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => switchDemoUser('STUDENT')}
                className="w-full p-3 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 text-left text-xs transition-colors shadow-2xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900">🎓 Học sinh: Trần Hoài An</div>
                  <div className="text-[11px] text-slate-500">Khối 8 (THCS) • Gửi phiếu & chat AI</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => switchDemoUser('COUNSELOR')}
                className="w-full p-3 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 text-left text-xs transition-colors shadow-2xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900">🩺 Tư vấn viên: ThS. Nguyễn Tuấn Anh</div>
                  <div className="text-[11px] text-slate-500">Toàn quyền xử lý ca & ghi chú nội bộ</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => switchDemoUser('TEACHER')}
                className="w-full p-3 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 text-left text-xs transition-colors shadow-2xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900">👩‍🏫 Giáo viên: Cô Mai Lan</div>
                  <div className="text-[11px] text-slate-500">GVCN 7A2 • Xem học sinh phụ trách</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => switchDemoUser('PARENT')}
                className="w-full p-3 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 text-left text-xs transition-colors shadow-2xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900">🏡 Phụ huynh: Chị Tuyết Mai</div>
                  <div className="text-[11px] text-slate-500">Phụ huynh học sinh Hoài An</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => switchDemoUser('ADMIN')}
                className="w-full p-3 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 text-left text-xs transition-colors shadow-2xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900">🛡️ Quản trị viên: Thầy Quang Minh</div>
                  <div className="text-[11px] text-slate-500">Ban Giám Hiệu • Báo cáo & Audit logs</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
