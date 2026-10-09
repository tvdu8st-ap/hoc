import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAgeMode } from '../context/AgeModeContext';
import {
  Heart,
  Smile,
  Bot,
  MessageSquare,
  Shield,
  BookOpen,
  Calendar,
  Lock,
  User as UserIcon,
  Menu,
  X,
  AlertTriangle,
  Sparkles,
  School,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  onOpenEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEmergency }) => {
  const location = useLocation();
  const { user, switchDemoUser } = useAuth();
  const { mode, isPrimary, toggleMode } = useAgeMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: School },
    { path: '/cam-xuc', label: 'Góc cảm xúc', icon: Smile },
    { path: '/tro-ly-ai', label: 'Trợ lý AI', icon: Bot, badge: 'Bạn Đồng Hành' },
    { path: '/chia-se', label: 'Góc chia sẻ', icon: MessageSquare },
    { path: '/chong-bat-nat', label: 'Chống bắt nạt', icon: Shield },
    { path: '/thu-vien', label: 'Thư viện kỹ năng', icon: BookOpen },
    { path: '/dang-ky-tu-van', label: 'Đăng ký tư vấn', icon: Calendar },
    {
      path: '/dashboard',
      label: 'Dành cho Thầy Cô',
      icon: Lock,
      restricted: true,
      roles: ['COUNSELOR', 'TEACHER', 'ADMIN'],
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner with Age Mode Toggle, SOS Button & Role Switcher */}
      <div className="bg-gradient-to-r from-sky-50 via-teal-50/50 to-indigo-50 border-b border-slate-200/60 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Slogan */}
          <div className="hidden md:flex items-center gap-2 text-slate-600 font-medium">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>Mỗi cảm xúc đều đáng được lắng nghe – Mỗi học sinh đều xứng đáng được yêu thương và hỗ trợ</span>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            {/* Age Mode Switcher */}
            <div className="flex items-center bg-white p-0.5 rounded-full border border-slate-200 shadow-xs">
              <button
                onClick={() => isPrimary || toggleMode()}
                className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-all ${
                  isPrimary
                    ? 'bg-amber-400 text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🧸</span>
                <span>Tiểu học (1-5)</span>
              </button>
              <button
                onClick={() => !isPrimary || toggleMode()}
                className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-all ${
                  !isPrimary
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🎓</span>
                <span>THCS (6-9)</span>
              </button>
            </div>

            {/* Role quick switcher (for testing different permissions) */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold hover:border-slate-300 transition-colors shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="truncate max-w-[110px]">
                  {user ? `${user.role}: ${user.fullName.split(' ')[0]}` : 'Khách vãng lai'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Chuyển vai trò thử nghiệm:
                  </div>
                  <button
                    onClick={() => switchDemoUser('STUDENT')}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs hover:bg-sky-50 font-medium text-slate-700 flex items-center justify-between"
                  >
                    <span>🎓 Học sinh (An - THCS)</span>
                    {user?.role === 'STUDENT' && <span className="text-sky-600">✓</span>}
                  </button>
                  <button
                    onClick={() => switchDemoUser('COUNSELOR')}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs hover:bg-sky-50 font-medium text-slate-700 flex items-center justify-between"
                  >
                    <span>🩺 Thầy Tuấn Anh (Tư vấn viên)</span>
                    {user?.role === 'COUNSELOR' && <span className="text-sky-600">✓</span>}
                  </button>
                  <button
                    onClick={() => switchDemoUser('TEACHER')}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs hover:bg-sky-50 font-medium text-slate-700 flex items-center justify-between"
                  >
                    <span>👩‍🏫 Cô Lan (GVCN Lớp 7A2)</span>
                    {user?.role === 'TEACHER' && <span className="text-sky-600">✓</span>}
                  </button>
                  <button
                    onClick={() => switchDemoUser('PARENT')}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs hover:bg-sky-50 font-medium text-slate-700 flex items-center justify-between"
                  >
                    <span>🏡 Phụ huynh (Chị Mai)</span>
                    {user?.role === 'PARENT' && <span className="text-sky-600">✓</span>}
                  </button>
                  <button
                    onClick={() => switchDemoUser('ADMIN')}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs hover:bg-sky-50 font-medium text-slate-700 flex items-center justify-between"
                  >
                    <span>🛡️ Quản trị viên (Thầy Minh)</span>
                    {user?.role === 'ADMIN' && <span className="text-sky-600">✓</span>}
                  </button>
                  <button
                    onClick={() => switchDemoUser('GUEST')}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs hover:bg-slate-50 font-medium text-slate-500 border-t border-slate-100 mt-1"
                  >
                    <span>Ẩn danh / Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>

            {/* Emergency SOS Button */}
            <button
              onClick={onOpenEmergency}
              className="px-3.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 animate-pulse text-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-white" />
              <span>Em cần giúp đỡ ngay!</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-100 group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 fill-white/20" />
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-sky-700 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                GÓC LẮNG NGHE
              </div>
              <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                Cùng Em Trưởng Thành
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;

              // If restricted, only show if user has permitted role
              if (item.restricted && (!user || !item.roles?.includes(user.role))) {
                return null;
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 relative ${
                    active
                      ? 'text-sky-700 bg-sky-50/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded-full">
                      AI
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth Button on Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              to="/tai-khoan"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs"
            >
              <UserIcon className="w-4 h-4 text-sky-600" />
              <span>{user ? user.fullName.split(' ')[0] : 'Đăng nhập'}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            if (item.restricted && (!user || !item.roles?.includes(user.role))) {
              return null;
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  active ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-sky-600" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
                    AI
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/tai-khoan"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-800 rounded-xl text-sm font-bold"
            >
              <UserIcon className="w-4 h-4 text-sky-600" />
              <span>{user ? `Tài khoản: ${user.fullName}` : 'Đăng nhập hệ thống'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
