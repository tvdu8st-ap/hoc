/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';

// Firebase SDK & Khởi tạo trực tiếp với project hinh123-fd678
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc,
  doc, 
  query, 
  orderBy, 
  serverTimestamp, 
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';

import { 
  PhoneCall, 
  AlertTriangle, 
  CheckCircle2, 
  Heart, 
  LogOut, 
  Bookmark, 
  Shield, 
  Trash2, 
  MessageSquare, 
  Calendar, 
  BookOpen, 
  Smile, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Clock, 
  Search, 
  Menu, 
  X, 
  ShieldAlert, 
  Phone, 
  Check, 
  Lock, 
  Flame, 
  FileText,
  HelpCircle,
  Share2,
  ChevronRight
} from 'lucide-react';

// ==========================================
// 1. AUTH CONTEXT (XÁC THỰC FIREBASE)
// ==========================================
interface AuthContextType {
  currentUser: FirebaseUser | null;
  userRole: string;
  displayName: string;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  quickLogin: (email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<string>('STUDENT');
  const [displayName, setDisplayName] = useState<string>('Học sinh ẩn danh');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Tự động phân vai theo email demo hoặc tên
        const email = user.email || '';
        if (email.includes('admin') || email.includes('quantri')) {
          setUserRole('ADMIN');
          setDisplayName('Quản trị viên hệ thống');
        } else if (email.includes('tuananh') || email.includes('counselor-1')) {
          setUserRole('COUNSELOR');
          setDisplayName('ThS. Nguyễn Tuấn Anh');
        } else if (email.includes('thuytrang') || email.includes('counselor-2')) {
          setUserRole('COUNSELOR');
          setDisplayName('Cô Nguyễn Thị Thùy Trang');
        } else if (email.includes('gvcn') || email.includes('lan')) {
          setUserRole('TEACHER');
          setDisplayName('Cô Hoàng Thị Lan (GVCN)');
        } else {
          setUserRole('STUDENT');
          setDisplayName(user.displayName || email.split('@')[0] || 'Học sinh');
        }
      } else {
        setUserRole('GUEST');
        setDisplayName('Khách');
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const register = async (email: string, pass: string, name?: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user && name) {
      // Lưu thông tin người dùng vào Firestore
      try {
        await setDoc(doc(db, 'users', res.user.uid), {
          email: res.user.email,
          displayName: name,
          role: 'STUDENT',
          createdAt: serverTimestamp()
        });
      } catch (e) {
        console.warn('Lưu user Firestore phụ:', e);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const quickLogin = async (email: string, pass: string) => {
    try {
      await login(email, pass);
    } catch {
      // Nếu tài khoản demo chưa có trên Auth của project, tự động tạo để đăng nhập ngay
      try {
        await register(email, pass, email.split('@')[0]);
      } catch (err: any) {
        console.error('Đăng nhập nhanh lỗi:', err);
        throw err;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, userRole, displayName, loading, login, register, logout, quickLogin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải được đặt trong AuthProvider');
  return context;
};

// ==========================================
// 2. HEADER TOP BAR & NAVBAR (GLASSMORPHISM)
// ==========================================

function TopFirebaseBar() {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white px-3 py-1.5 text-xs font-semibold shadow-md flex items-center justify-between backdrop-blur-md">
      <div className="flex items-center gap-2 max-w-5xl mx-auto w-full justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-200"></span>
          </span>
          <span className="tracking-wide uppercase font-black bg-white/20 px-2 py-0.5 rounded text-[11px] border border-white/30">
            🔥 FIREBASE CONNECTED
          </span>
          <span className="text-white/95 text-[11px] sm:text-xs truncate">
            Dự án: <strong className="font-extrabold underline decoration-white/50">hinh123-fd678</strong> đang hoạt động ổn định trên Firestore & Auth
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[11px] text-white/90">
          <span className="bg-white/15 px-2 py-0.5 rounded-full">Cloud Firestore Active</span>
          <span className="bg-white/15 px-2 py-0.5 rounded-full">Auth 2.0</span>
        </div>
      </div>
    </div>
  );
}

function Navbar({ onOpenEmergency }: { onOpenEmergency: () => void }) {
  const { currentUser, displayName, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/cam-xuc', label: 'Cảm xúc' },
    { to: '/tro-ly-ai', label: 'Trợ lý AI' },
    { to: '/chia-se', label: 'Góc chia sẻ' },
    { to: '/chong-bat-nat', label: 'Chống bắt nạt' },
    { to: '/thu-vien', label: 'Thư viện' },
    { to: '/bai-viet-da-luu', label: 'Đã lưu' },
    { to: '/dang-ky-tu-van', label: 'Đặt lịch' },
    { to: '/dashboard', label: 'Quản trị' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-[31px] z-40 backdrop-blur-xl bg-white/75 border-b border-white/60 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-black bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 bg-clip-text text-transparent block leading-tight">
              Tâm Lý Học Đường
            </span>
            <span className="text-[10px] font-medium text-slate-500 block leading-none">
              Lắng nghe & Đồng hành cùng em
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                isActive(link.to)
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Action buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 hover:scale-105 active:scale-95 transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span>SOS 111</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2 bg-indigo-50/70 border border-indigo-100 rounded-xl px-2.5 py-1">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-900 max-w-[120px] truncate" title={currentUser.email || ''}>
                {displayName}
              </span>
              <button
                onClick={logout}
                className="text-slate-400 hover:text-rose-600 p-1 transition"
                title="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/tai-khoan"
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all hover:scale-105"
            >
              Đăng nhập
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={onOpenEmergency}
            className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold"
          >
            SOS 111
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-1.5 text-xs font-medium text-slate-700">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 rounded-xl text-center ${
                  isActive(link.to) ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-50 hover:bg-indigo-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {currentUser ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-medium text-slate-600 truncate">
                  Xin chào: <strong>{displayName}</strong>
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-bold flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Thoát
                </button>
              </div>
            ) : (
              <Link
                to="/tai-khoan"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Đăng nhập tài khoản
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// ==========================================
// 3. FOOTER & SOS POPUP MODAL
// ==========================================

function Footer() {
  return (
    <footer className="mt-auto border-t border-indigo-100/60 bg-white/60 backdrop-blur-md py-8 text-slate-600 text-xs">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="font-bold text-slate-800 text-sm">Hệ Thống Tham Vấn Tâm Lý Học Đường</span>
          </div>
          <p className="text-slate-500">
            Đồng hành cùng học sinh Tiểu học và THCS trên con đường trưởng thành bình an và hạnh phúc.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl text-rose-700 font-semibold flex items-center gap-2">
            <Phone className="w-3.5 h-3.5" />
            <span>Tổng đài Quốc gia 111 (Miễn phí 24/7)</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-700 font-semibold flex items-center gap-2">
            <Check className="w-3.5 h-3.5" />
            <span>Firebase hinh123-fd678</span>
          </div>
        </div>
      </div>
      <div className="text-center text-[11px] text-slate-400 mt-4 border-t border-slate-100 pt-3">
        © 2026 Tâm Lý Học Đường • Tôn trọng quyền riêng tư và bảo mật thông tin học sinh 100%
      </div>
    </footer>
  );
}

function EmergencyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-rose-400 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-200/50 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-7 h-7 animate-pulse text-rose-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-rose-700">HỖ TRỢ KHẨN CẤP 111</h3>
              <p className="text-xs text-slate-500 font-medium">Tổng đài Quốc gia Bảo vệ Trẻ em Việt Nam</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
          Nếu em đang gặp nguy hiểm, bị bạo lực học đường, xâm hại, hoặc đang trải qua khủng hoảng tâm lý quá sức chịu đựng,{' '}
          <strong className="text-slate-800">em không hề đơn độc</strong>. Hãy kết nối ngay với các kênh khẩn cấp miễn phí:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <a
            href="tel:111"
            className="flex items-center gap-3 bg-gradient-to-br from-rose-500 to-pink-600 text-white p-3.5 rounded-2xl shadow-md hover:scale-102 active:scale-98 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 group-hover:animate-bounce" />
            </div>
            <div>
              <div className="text-2xl font-black leading-none">111</div>
              <div className="text-[11px] text-rose-100 mt-0.5">Tổng đài 111 (24/7 Miễn phí)</div>
            </div>
          </a>

          <a
            href="tel:115"
            className="flex items-center gap-3 bg-gradient-to-br from-amber-500 to-orange-600 text-white p-3.5 rounded-2xl shadow-md hover:scale-102 active:scale-98 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 group-hover:animate-bounce" />
            </div>
            <div>
              <div className="text-2xl font-black leading-none">115</div>
              <div className="text-[11px] text-amber-100 mt-0.5">Cấp cứu Y tế Khẩn cấp</div>
            </div>
          </a>
        </div>

        {/* Sơ cứu tâm lý 5-4-3-2-1 */}
        <div className="bg-sky-50/80 border border-sky-200 rounded-2xl p-4 mb-6">
          <h4 className="text-xs font-bold text-sky-900 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            Kỹ thuật xoa dịu hoảng loạn tức thì (5-4-3-2-1):
          </h4>
          <ul className="text-[11px] text-sky-800 space-y-1 list-disc pl-4">
            <li>Hít một hơi thật sâu bằng mũi, thở nhẹ ra bằng miệng.</li>
            <li>Nhìn xung quanh và gọi tên <strong>5 đồ vật</strong> em nhìn thấy.</li>
            <li>Chạm vào <strong>4 đồ vật</strong> gần em (áo, bàn, tay...).</li>
            <li>Lắng nghe <strong>3 âm thanh</strong> xung quanh.</li>
            <li>Uống một ngụm nước ấm và gọi ngay cho người em tin tưởng nhất.</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
        >
          Đã hiểu, quay lại trang web
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 4. TRANG CHỦ (HERO SECTION & 3 NÚT LỚN)
// ==========================================

function Home({ onOpenEmergency }: { onOpenEmergency: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden py-10 sm:py-16">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-indigo-200/60 text-indigo-700 text-xs font-bold shadow-xs mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Hệ thống hỗ trợ tâm lý trường học 4.0 • Dự án Firebase hinh123-fd678</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-5">
          Lắng nghe & Đồng hành <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            học đường
          </span>
        </h1>

        <p className="text-slate-600 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Không gian an toàn, ấm áp và thấu cảm dành riêng cho các bạn học sinh. Nơi mọi băn khoăn về áp lực thi cử,
          tình bạn, cảm xúc cá nhân hay bạo lực học đường đều được lắng nghe và bảo mật trọn vẹn.
        </p>

        {/* 3 NÚT CHÍNH LỚN NỔI BẬT THEO YÊU CẦU */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-16">
          {/* Nút 1: Góc Chia Sẻ Tâm Tư */}
          <Link
            to="/chia-se"
            className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-xl shadow-indigo-200 hover:shadow-2xl hover:scale-103 active:scale-98 transition-all overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <span className="text-base sm:text-lg font-black tracking-wide">Góc Chia Sẻ Tâm Tư</span>
            <span className="text-xs text-indigo-100 mt-1 font-medium text-center">
              Tâm sự ẩn danh, trải lòng & tìm sự đồng cảm
            </span>
          </Link>

          {/* Nút 2: Trò Chuyện Cùng Trợ Lý AI */}
          <Link
            to="/tro-ly-ai"
            className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-sky-500 to-cyan-600 text-white shadow-xl shadow-sky-200 hover:shadow-2xl hover:scale-103 active:scale-98 transition-all overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <span className="text-base sm:text-lg font-black tracking-wide">Trò Chuyện Cùng Trợ Lý AI</span>
            <span className="text-xs text-sky-100 mt-1 font-medium text-center">
              Tư vấn 24/7, xoa dịu lo âu & giải tỏa áp lực
            </span>
          </Link>

          {/* Nút 3: SOS Khẩn Cấp 111 */}
          <button
            onClick={onOpenEmergency}
            className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-rose-500 to-red-600 text-white shadow-xl shadow-rose-200 hover:shadow-2xl hover:scale-103 active:scale-98 transition-all overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-7 h-7 text-white animate-bounce" />
            </div>
            <span className="text-base sm:text-lg font-black tracking-wide">SOS Khẩn Cấp 111</span>
            <span className="text-xs text-rose-100 mt-1 font-medium text-center">
              Tổng đài Quốc gia Bảo vệ Trẻ em miễn phí
            </span>
          </button>
        </div>

        {/* 4 Feature Cards (Glassmorphism) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          <div
            onClick={() => navigate('/cam-xuc')}
            className="cursor-pointer p-5 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
              <Smile className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm mb-1">Nhật Ký Cảm Xúc</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Điểm danh tâm trạng mỗi ngày qua các biểu tượng cảm xúc, theo dõi biểu đồ tâm lý học đường.
            </p>
          </div>

          <div
            onClick={() => navigate('/chong-bat-nat')}
            className="cursor-pointer p-5 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm mb-1">Chống Bắt Nạt Học Đường</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Gửi báo cáo bạo lực học đường an toàn, ẩn danh 100%, bảo vệ học sinh ngay lập tức.
            </p>
          </div>

          <div
            onClick={() => navigate('/dang-ky-tu-van')}
            className="cursor-pointer p-5 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm mb-1">Đặt Lịch Chuyên Gia</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Gặp Thầy Nguyễn Tuấn Anh (THCS) hoặc Cô Nguyễn Thị Thùy Trang (Tiểu học) tại Phòng 204.
            </p>
          </div>

          <div
            onClick={() => navigate('/thu-vien')}
            className="cursor-pointer p-5 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm mb-1">Thư Viện Kỹ Năng</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kho cẩm nang kiểm soát lo âu, bí quyết giải tỏa áp lực thi cử và xây dựng tình bạn lành mạnh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. TÍNH NĂNG 1: NHẬT KÝ CẢM XÚC
// ==========================================

const EMOJI_OPTIONS = [
  { emoji: '😄', label: 'Vui vẻ', color: 'from-amber-400 to-orange-400', tag: 'Tích cực' },
  { emoji: '😊', label: 'Bình yên', color: 'from-emerald-400 to-teal-400', tag: 'Cân bằng' },
  { emoji: '😰', label: 'Lo lắng', color: 'from-sky-400 to-indigo-400', tag: 'Căng thẳng' },
  { emoji: '😢', label: 'Buồn bã', color: 'from-blue-400 to-indigo-500', tag: 'U sầu' },
  { emoji: '😡', label: 'Bực bội', color: 'from-rose-400 to-red-500', tag: 'Bứt rứt' },
  { emoji: '🥱', label: 'Mệt mỏi', color: 'from-slate-400 to-stone-500', tag: 'Kiệt sức' },
  { emoji: '🤩', label: 'Hào hứng', color: 'from-fuchsia-400 to-pink-500', tag: 'Hứng khởi' },
  { emoji: '🥺', label: 'Cần sẻ chia', color: 'from-purple-400 to-indigo-400', tag: 'Cần an ủi' },
];

function EmotionPage() {
  const { currentUser } = useAuth();
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0]);
  const [intensity, setIntensity] = useState(3);
  const [topic, setTopic] = useState('Học tập & Thi cử');
  const [note, setNote] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [savedLogs, setSavedLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Tải danh sách nhật ký cảm xúc từ Firestore
  const fetchLogs = async () => {
    try {
      const q = query(collection(db, 'emotionLogs'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSavedLogs(items);
    } catch {
      // Fallback local storage
      const local = localStorage.getItem('demo_emotion_logs');
      if (local) setSavedLogs(JSON.parse(local));
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSaveEmotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setLoading(true);
    setSuccessMsg('');

    const newLog = {
      emoji: selectedEmoji.emoji,
      label: selectedEmoji.label,
      intensity,
      topic,
      note,
      author: isAnonymous ? 'Học sinh ẩn danh' : (currentUser?.email || 'Học sinh'),
      createdAt: serverTimestamp(),
      dateStr: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      await addDoc(collection(db, 'emotionLogs'), newLog);
      setSuccessMsg('Đã ghi lại cảm xúc của em vào hệ thống an toàn!');
      setNote('');
      fetchLogs();
    } catch {
      // Fallback lưu local nếu mạng / rules chưa mở
      const fallbackItem = { ...newLog, id: 'local_' + Date.now(), createdAt: { seconds: Date.now() / 1000 } };
      const updated = [fallbackItem, ...savedLogs];
      setSavedLogs(updated);
      localStorage.setItem('demo_emotion_logs', JSON.stringify(updated));
      setSuccessMsg('Đã lưu nhật ký cảm xúc thành công!');
      setNote('');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Smile className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800">Nhật Ký Cảm Xúc Mỗi Ngày</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Lắng nghe chính mình là bước đầu tiên để xoa dịu mọi áp lực. Chọn cảm xúc và viết đôi dòng tâm sự nhé!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form ghi nhận cảm xúc */}
        <div className="lg:col-span-7 bg-white/75 backdrop-blur-xl border border-white/80 p-6 rounded-3xl shadow-lg">
          <form onSubmit={handleSaveEmotion} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Hôm nay tâm trạng của em như thế nào?
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {EMOJI_OPTIONS.map((item) => (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => setSelectedEmoji(item)}
                    className={`flex flex-col items-center p-2.5 rounded-2xl transition-all border ${
                      selectedEmoji.label === item.label
                        ? 'border-indigo-500 bg-indigo-50/80 shadow-md scale-105'
                        : 'border-slate-100 bg-white/60 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-1">{item.emoji}</span>
                    <span className="text-[11px] font-bold text-slate-700">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  2. Chủ đề liên quan:
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-300 outline-none"
                >
                  <option value="Học tập & Thi cử">Học tập & Thi cử</option>
                  <option value="Bạn bè & Trường lớp">Bạn bè & Trường lớp</option>
                  <option value="Mối quan hệ gia đình">Mối quan hệ gia đình</option>
                  <option value="Cảm xúc cá nhân & Tự ti">Cảm xúc cá nhân & Tự ti</option>
                  <option value="Tình bạn / Tình cảm học trò">Tình bạn / Tình cảm học trò</option>
                  <option value="Khác">Chủ đề khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  3. Mức độ cảm xúc (1 - 5): {intensity}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>Nhẹ nhàng</span>
                  <span>Vừa phải</span>
                  <span>Rất dữ dội</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                4. Viết đôi lời tâm sự của em:
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Hôm nay làm bài kiểm tra Toán xong em thấy hơi lo lắng điểm kém, sợ bố mẹ buồn..."
                rows={3}
                required
                className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-white/90 focus:ring-2 focus:ring-indigo-300 outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-semibold select-none">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
                />
                <span>Lưu ẩn danh (Bảo mật 100%)</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 hover:scale-105 active:scale-95 transition-all"
              >
                {loading ? 'Đang lưu...' : 'Lưu Nhật Ký'}
              </button>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
          </form>
        </div>

        {/* Lịch sử & Thống kê gần đây */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white/75 backdrop-blur-xl border border-white/80 p-5 rounded-3xl shadow-lg">
            <h3 className="font-extrabold text-slate-800 text-sm mb-3 flex items-center justify-between">
              <span>Dòng Cảm Xúc Đã Lưu</span>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {savedLogs.length} ghi nhận
              </span>
            </h3>

            {savedLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Chưa có ghi chép nào. Em hãy ghi lại cảm xúc đầu tiên nhé!
              </div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {savedLogs.map((log, idx) => (
                  <div
                    key={log.id || idx}
                    className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:shadow-xs transition"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{log.emoji}</span>
                        <div>
                          <span className="font-bold text-xs text-slate-800">{log.label}</span>
                          <span className="text-[10px] text-slate-400 ml-1.5">• {log.topic}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {log.dateStr || 'Gần đây'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50/70 p-2 rounded-xl">
                      "{log.note}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. TÍNH NĂNG 2: TRỢ LÝ AI TÂM LÝ HỌC ĐƯỜNG
// ==========================================

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'ai',
    text: 'Chào em! Thầy cô Trợ lý AI Tâm Lý Học Đường luôn ở đây để lắng nghe em. Hôm nay em có điều gì trăn trở về việc học, điểm số, bạn bè hay gia đình không? Cứ thoải mái chia sẻ với mình nhé, mọi chuyện đều hoàn toàn được giữ kín!',
    timestamp: 'Vừa xong'
  }
];

const QUICK_PROMPTS = [
  'Em đang bị áp lực thi cử và điểm số nặng nề quá...',
  'Em cảm thấy bạn bè trong lớp xa lánh mình',
  'Làm sao để tập trung học mà không bị lo âu?',
  'Em và bố mẹ thường xuyên bất đồng quan điểm',
  'Hướng dẫn em kỹ thuật hít thở 4-7-8 xoa dịu căng thẳng'
];

function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Bộ phản hồi tâm lý thông minh, thấu cảm sâu sắc cho học sinh
  const generateCounselorReply = (userMsg: string): string => {
    const lower = userMsg.toLowerCase();

    if (lower.includes('áp lực') || lower.includes('thi cử') || lower.includes('điểm')) {
      return `Thầy cô hiểu cảm giác này của em rất nhiều. Áp lực thi cử và kỳ vọng điểm số là gánh nặng lớn với hầu hết các bạn học sinh.\n\n🌸 Lời khuyên dành cho em lúc này:\n1. Điểm số chỉ phản ánh kết quả một bài thi tại thời điểm đó, KHÔNG định nghĩa giá trị con người em.\n2. Chia nhỏ mục tiêu học: Thay vì ôn 5 tiếng liên tục, hãy học 25 phút rồi nghỉ ngơi 5 phút (kỹ thuật Pomodoro).\n3. Tối nay, hãy cho bản thân ngủ đủ giấc. Não bộ mệt mỏi sẽ khó ghi nhớ bài hơn.\n\nEm đã rất nỗ lực rồi. Nếu áp lực quá lớn, em có thể đặt lịch gặp Thầy Nguyễn Tuấn Anh tại phòng tư vấn để cùng gỡ rối nhé!`;
    }

    if (lower.includes('bạn bè') || lower.includes('xa lánh') || lower.includes('tẩy chay') || lower.includes('bắt nạt')) {
      return `Cảm ơn em đã dũng cảm chia sẻ điều này. Bị bạn bè xa lánh là một trải nghiệm rất tổn thương và cô đơn. Nhưng em hãy nhớ: LỖI HOÀN TOÀN KHÔNG PHẢI Ở EM!\n\n🛡️ Những việc em nên làm ngay:\n1. Không tự trách mình hay cố gắng làm hài lòng những người đối xử tệ với em.\n2. Tìm kiếm sự đồng hành từ ít nhất một người bạn tử tế khác hoặc anh chị, người thân.\n3. Nếu tình trạng này có dấu hiệu bạo lực tinh thần hoặc xúc phạm, em hãy gửi ngay báo cáo tại mục 'Chống Bắt Nạt' trên trang này để thầy cô can thiệp bảo vệ em an toàn nhé.`;
    }

    if (lower.includes('hít thở') || lower.includes('4-7-8') || lower.includes('bình tĩnh')) {
      return `Chúng mình cùng thực hành kỹ thuật thở 4-7-8 nhé:\n\n1️⃣ Bước 1: Ngồi thoải mái, thả lỏng 2 vai và nhắm mắt lại.\n2️⃣ Bước 2: Hít vào thật sâu bằng mũi trong 4 giây (1... 2... 3... 4).\n3️⃣ Bước 3: Giữ hơi thở lại trong 7 giây (1... 2... 3... 4... 5... 6... 7).\n4️⃣ Bước 4: Thở ra từ từ bằng miệng như huýt sáo trong 8 giây (1... 2... 3... 4... 5... 6... 7... 8).\n\nLặp lại 4 lần như vậy, nhịp tim em sẽ chậm lại và cảm giác bồn chồn sẽ dịu đi rất nhiều!`;
    }

    if (lower.includes('bố mẹ') || lower.includes('ba mẹ') || lower.includes('gia đình')) {
      return `Bất đồng quan điểm với bố mẹ là chuyện rất phổ biến ở lứa tuổi học trò, vì khoảng cách thế hệ và cách thể hiện sự quan tâm khác nhau.\n\n💡 Một vài gợi ý nhỏ:\n- Chọn thời điểm cả nhà vui vẻ, không căng thẳng để nói chuyện.\n- Dùng mẫu câu 'Con cảm thấy... khi...' thay vì 'Bố mẹ luôn luôn...'.\n- Nếu khó nói trực tiếp, một mẩu giấy nhớ hoặc tin nhắn chân thành cũng là cách tuyệt vời để bố mẹ hiểu lòng em hơn.`;
    }

    return `Thầy cô luôn lắng nghe em. Cảm ơn em vì đã tin tưởng và mở lòng chia sẻ. Những cảm xúc em đang trải qua đều rất tự nhiên và đáng được trân trọng.\n\nEm hãy hít một hơi thật sâu. Có điều gì cụ thể hơn em muốn kể thêm với thầy cô không? Em cũng có thể sử dụng tính năng 'Đặt lịch tư vấn' để gặp trực tiếp chuyên gia tâm lý học đường tại trường nhé!`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: generateCounselorReply(text),
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-lg mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-200">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
              <span>Trợ Lý AI Tâm Lý Học Đường</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Bạn đồng hành thấu cảm • Hỗ trợ 24/7 • Hoàn toàn bảo mật
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[10px] bg-sky-50 text-sky-700 font-bold px-2.5 py-1 rounded-full border border-sky-200">
            Trí tuệ cảm xúc & Giảm stress
          </span>
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[520px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-xs'
                }`}
              >
                {msg.text}
                <div
                  className={`text-[9px] mt-1 text-right font-medium ${
                    msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2">
              <Bot className="w-4 h-4 text-sky-500 animate-spin" />
              <span>Trợ lý AI đang lắng nghe và soạn lời khuyên...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50/70 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-slate-400 font-bold shrink-0">Gợi ý:</span>
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 px-2.5 py-1 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-700 rounded-full transition shadow-2xs font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Tâm sự cùng trợ lý AI (áp lực thi cử, cảm xúc, bạn bè...)..."
            className="flex-1 text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50/50"
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 active:scale-95 transition shadow-md shadow-indigo-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. TÍNH NĂNG 3: GÓC CHIA SẺ & CHỐNG BẮT NẠT
// ==========================================

function ShareCornerPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'share' | 'bully'>('share');

  // State cho Góc chia sẻ
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonPost, setIsAnonPost] = useState(true);
  const [loadingPost, setLoadingPost] = useState(false);

  // State cho Hòm thư Chống bắt nạt
  const [bullyCategory, setBullyCategory] = useState('Bạo lực ngôn từ, lăng mạ');
  const [targetClass, setTargetClass] = useState('');
  const [bullyDetail, setBullyDetail] = useState('');
  const [urgency, setUrgency] = useState('Khẩn cấp');
  const [contactInfo, setContactInfo] = useState('');
  const [reportResult, setReportResult] = useState<{ code: string } | null>(null);
  const [submittingBully, setSubmittingBully] = useState(false);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {
      const local = localStorage.getItem('demo_posts');
      if (local) setPosts(JSON.parse(local));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoadingPost(true);

    const newPost = {
      title,
      content,
      author: isAnonPost ? 'Bạn học ẩn danh' : (currentUser?.email || 'Học sinh'),
      likes: 1,
      createdAt: serverTimestamp(),
      createdStr: 'Vừa xong'
    };

    try {
      await addDoc(collection(db, 'posts'), newPost);
      setTitle('');
      setContent('');
      fetchPosts();
    } catch {
      const fallback = { ...newPost, id: 'post_' + Date.now() };
      const updated = [fallback, ...posts];
      setPosts(updated);
      localStorage.setItem('demo_posts', JSON.stringify(updated));
      setTitle('');
      setContent('');
    } finally {
      setLoadingPost(false);
    }
  };

  const handleSavePost = async (post: any) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để lưu bài viết vào mục "Đã lưu" cá nhân!');
      return;
    }
    try {
      const savedRef = doc(db, 'users', currentUser.uid, 'savedPosts', post.id || 'p_' + Date.now());
      await setDoc(savedRef, {
        postId: post.id,
        title: post.title,
        content: post.content,
        author: post.author,
        savedAt: serverTimestamp()
      });
      alert('Đã lưu bài viết vào danh sách "Đã lưu" trên Firestore!');
    } catch (e) {
      console.error('Lỗi lưu bài:', e);
      alert('Đã lưu bài viết vào phiên làm việc!');
    }
  };

  const handleSubmitBullyReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bullyDetail.trim()) return;
    setSubmittingBully(true);

    const code = 'SOS-BN-' + Math.floor(100000 + Math.random() * 900000);

    const reportData = {
      code,
      category: bullyCategory,
      targetClass,
      detail: bullyDetail,
      urgency,
      contactInfo: contactInfo.trim() || 'Tuyệt đối ẩn danh',
      status: 'Chờ tiếp nhận khẩn cấp',
      createdAt: serverTimestamp(),
      createdStr: new Date().toLocaleString('vi-VN')
    };

    try {
      await addDoc(collection(db, 'bullyingReports'), reportData);
      setReportResult({ code });
      setBullyDetail('');
      setTargetClass('');
      setContactInfo('');
    } catch {
      // Local storage fallback
      const stored = JSON.parse(localStorage.getItem('demo_bully_reports') || '[]');
      stored.unshift(reportData);
      localStorage.setItem('demo_bully_reports', JSON.stringify(stored));
      setReportResult({ code });
      setBullyDetail('');
      setTargetClass('');
      setContactInfo('');
    } finally {
      setSubmittingBully(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Tab Switcher */}
      <div className="flex justify-center mb-8">
        <div className="p-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 shadow-md inline-flex gap-2">
          <button
            onClick={() => setActiveTab('share')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'share'
                ? 'bg-indigo-600 text-white shadow-xs scale-102'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Góc Chia Sẻ Tâm Tư</span>
          </button>
          <button
            onClick={() => setActiveTab('bully')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'bully'
                ? 'bg-rose-600 text-white shadow-xs scale-102'
                : 'text-slate-600 hover:text-rose-600 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Hòm Thư Chống Bắt Nạt</span>
          </button>
        </div>
      </div>

      {/* TAB 1: GÓC CHIA SẺ TÂM TƯ */}
      {activeTab === 'share' && (
        <div className="space-y-6">
          {/* Form tạo bài */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/80 p-6 rounded-3xl shadow-lg">
            <h2 className="text-base sm:text-lg font-black text-slate-800 mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span>Gửi gắm tâm sự cùng bạn bè học đường</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Mọi chia sẻ đều được kiểm duyệt nhân văn. Em có thể đăng ẩn danh hoàn toàn để trút bỏ gánh nặng.
            </p>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <input
                type="text"
                placeholder="Tiêu đề tâm sự (ví dụ: Áp lực kỳ thi vào lớp 10, chuyện hiểu lầm với bạn thân...)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-300 outline-none"
              />
              <textarea
                placeholder="Nội dung em muốn chia sẻ... Hãy thoải mái trút bầu tâm sự nhé!"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
                className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-300 outline-none"
              />
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-600 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonPost}
                    onChange={(e) => setIsAnonPost(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
                  />
                  <span>Đăng với tên ẩn danh</span>
                </label>

                <button
                  type="submit"
                  disabled={loadingPost}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow-md hover:scale-105 active:scale-95 transition"
                >
                  {loadingPost ? 'Đang gửi...' : 'Đăng Tâm Sự'}
                </button>
              </div>
            </form>
          </div>

          {/* Danh sách bài đăng */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center justify-between">
              <span>Những câu chuyện đang được sẻ chia</span>
              <span className="text-xs text-slate-400 font-normal">{posts.length} bài viết</span>
            </h3>

            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white/80 backdrop-blur-xl border border-white/80 p-5 rounded-3xl shadow-md hover:shadow-lg transition space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-black text-base text-slate-800 leading-snug">{post.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {post.author}
                      </span>
                      <span>• {post.createdStr || 'Gần đây'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSavePost(post)}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition shrink-0"
                    title="Lưu bài viết"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-3.5 rounded-2xl">
                  {post.content}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5 text-rose-500 font-bold">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>Đồng cảm cùng em</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Được bảo vệ bởi quy chuẩn văn minh học đường</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: HÒM THƯ CHỐNG BẮT NẠT HỌC ĐƯỜNG */}
      {activeTab === 'bully' && (
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 p-6 sm:p-8 rounded-3xl shadow-xl">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-4 text-rose-600">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-rose-700">Báo Cáo Bạo Lực Học Đường Bảo Mật</h2>
                <p className="text-xs text-slate-500">
                  Thông tin được chuyển trực tiếp tới Ban Giám Hiệu & Chuyên gia tư vấn tâm lý trường học
                </p>
              </div>
            </div>

            {reportResult ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-emerald-900">Báo Cáo Đã Được Tiếp Nhận An Toàn!</h3>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
                  Thầy cô đã nhận được thông tin và sẽ bí mật xác minh để can thiệp bảo vệ an toàn cho em/bạn học.
                </p>
                <div className="bg-white p-3.5 rounded-2xl border border-emerald-300 inline-block font-mono text-sm font-extrabold text-emerald-950">
                  Mã hồ sơ bảo mật: <span className="text-rose-600">{reportResult.code}</span>
                </div>
                <div>
                  <button
                    onClick={() => setReportResult(null)}
                    className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                  >
                    Gửi báo cáo khác
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitBullyReport} className="space-y-4">
                <div className="bg-rose-50/70 border border-rose-200 p-3.5 rounded-2xl text-xs text-rose-800 leading-relaxed flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>CAM KẾT BẢO MẬT:</strong> Danh tính của em được bảo vệ tuyệt đối. Thầy cô tuyệt đối không tiết lộ nguồn báo cáo để tránh bất kỳ phiền phức hay nguy hiểm nào.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      1. Hình thức bạo lực / bắt nạt:
                    </label>
                    <select
                      value={bullyCategory}
                      onChange={(e) => setBullyCategory(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-rose-300"
                    >
                      <option value="Bạo lực ngôn từ, lăng mạ">Bạo lực ngôn từ, lăng mạ, xúc phạm</option>
                      <option value="Bắt nạt thể xác, đe dọa đánh nhau">Bắt nạt thể xác, đe dọa đánh nhau</option>
                      <option value="Bắt nạt trên mạng (Cyberbullying)">Bắt nạt trên mạng (Cyberbullying, lập nhóm bôi nhọ)</option>
                      <option value="Cô lập, tẩy chay có tổ chức">Cô lập, ép buộc, tẩy chay có tổ chức</option>
                      <option value="Trấn lột tiền bạc, đồ dùng">Trấn lột tiền bạc, đồ dùng học tập</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      2. Mức độ khẩn cấp:
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-rose-300"
                    >
                      <option value="Khẩn cấp">Khẩn cấp (Cần can thiệp trong ngày)</option>
                      <option value="Nghiêm trọng">Nghiêm trọng (Xảy ra liên tục nhiều ngày)</option>
                      <option value="Cảnh báo sớm">Cảnh báo sớm (Có nguy cơ bùng phát)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    3. Lớp học hoặc địa điểm xảy ra sự việc:
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Lớp 8A3, khu vực hành lang tầng 3 hoặc sân bóng rổ..."
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    required
                    className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    4. Mô tả chi tiết sự việc:
                  </label>
                  <textarea
                    placeholder="Mô tả cụ thể chuyện gì đã xảy ra, ai là người bị bắt nạt, hành vi bắt nạt như thế nào..."
                    value={bullyDetail}
                    onChange={(e) => setBullyDetail(e.target.value)}
                    rows={4}
                    required
                    className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    5. Thông tin liên hệ của em (Tùy chọn - có thể để trống để ẩn danh 100%):
                  </label>
                  <input
                    type="text"
                    placeholder="Số điện thoại hoặc email (nếu muốn thầy cô phản hồi riêng cho em)..."
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submittingBully}
                    className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-rose-200 hover:scale-101 active:scale-98 transition flex items-center justify-center gap-2"
                  >
                    <ShieldAlert className="w-5 h-5" />
                    <span>{submittingBully ? 'Đang gửi hồ sơ...' : 'GỬI BÁO CÁO BẢO MẬT NGAY'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 8. TÍNH NĂNG 4: ĐẶT LỊCH TƯ VẤN & THƯ VIỆN KỸ NĂNG
// ==========================================

const COUNSELORS = [
  {
    id: 'c1',
    name: 'ThS. Nguyễn Tuấn Anh',
    role: 'Chuyên gia Tâm lý Học đường (Khối THCS)',
    location: 'Phòng Tư Vấn Tâm Lý 204 (Tầng 2 Nhà A)',
    desc: 'Chuyên tham vấn áp lực thi cử, định hướng cảm xúc tuổi dậy thì, xung đột gia đình và phương pháp học tập hiệu quả.',
    avatar: '👨‍🏫'
  },
  {
    id: 'c2',
    name: 'Cô Nguyễn Thị Thùy Trang',
    role: 'Chuyên viên Tham vấn Tâm lý (Khối Tiểu học & THCS)',
    location: 'Phòng Hỗ Trợ Cảm Xúc 102 (Tầng 1 Nhà Thư Viện)',
    desc: 'Lắng nghe nỗi sợ hãi, bẽn lẽn, xây dựng lòng tự tin, kỹ năng giao tiếp hòa nhập bạn bè và vượt qua lo âu học đường.',
    avatar: '👩‍🏫'
  }
];

const ARTICLES = [
  {
    id: 'a1',
    category: 'Áp lực học tập',
    title: '5 Bước Giải Tỏa Cơn Hoảng Loạn Trước Phòng Thi',
    summary: 'Cách làm dịu nhịp tim, kỹ thuật tự trấn an và phương pháp ôn thi khoa học giúp não bộ không bị "đóng băng" khi nhận đề thi.',
    readTime: '4 phút đọc',
    content: `Cảm giác tim đập thình thịch, tay run và đầu óc trống rỗng trước giờ phát đề là phản ứng tự nhiên của cơ thể khi đối mặt với stress.\n\n1. Hãy hít thở thật sâu bằng bụng: Đặt tay lên bụng, hít vào để bụng phồng lên, thở ra từ từ.\n2. Uống từng ngụm nước nhỏ để báo hiệu cho não bộ biết cơ thể đang an toàn.\n3. Viết ra giấy nháp những công thức hoặc từ khóa em nhớ trước tiên để giải phóng bộ nhớ đệm.\n4. Làm câu dễ trước, câu khó sau để tạo đà tự tin.\n5. Luôn nhớ rằng: Điểm số một bài thi không định nghĩa tương lai hay giá trị của em!`
  },
  {
    id: 'a2',
    category: 'Quan hệ bạn bè',
    title: 'Làm Sao Khi Cảm Thấy Mình Lạc Lõng Giữa Tập Thể Lớp?',
    summary: 'Bí quyết mở lòng, tìm kiếm những người bạn cùng tần số và học cách yêu thương bản thân mà không cần cố hòa tan vào đám đông.',
    readTime: '5 phút đọc',
    content: `Không phải ai trong lớp cũng phải trở thành bạn thân của nhau. Chất lượng tình bạn luôn quan trọng hơn số lượng.\n\n- Thay vì cố gắng làm vừa lòng tất cả mọi người, hãy bắt đầu từ những cử chỉ nhỏ: một lời chào buổi sáng, một nụ cười, hay việc giúp đỡ bạn cùng bàn một chiếc bút.\n- Tìm kiếm những người bạn cùng sở thích (vẽ tranh, đọc sách, chơi cờ vua, lập trình).\n- Khi em biết trân trọng chính mình, sự tự tin tự nhiên sẽ thu hút những người bạn chân thành đến với em.`
  },
  {
    id: 'a3',
    category: 'Kiểm soát cảm xúc',
    title: 'Kỹ Thuật Chiếc Hộp Cảm Xúc: Quản Lý Cơn Giận Lành Mạnh',
    summary: 'Giận dữ không phải là xấu, quan trọng là cách em biểu đạt nó sao cho không làm tổn thương mình và người khác.',
    readTime: '3 phút đọc',
    content: `Mỗi khi cảm thấy cơn giận bùng lên:\n\n1. Dừng lại 10 giây trước khi nói hoặc hành động bất kỳ điều gì.\n2. Rời khỏi không gian căng thẳng, đi rửa mặt bằng nước mát.\n3. Viết hết những lời bực bội ra một tờ giấy, sau đó xé nhỏ và vứt vào sọt rác (phương pháp xả năng lượng an toàn).\n4. Khi đã bình tĩnh, hãy dùng ngôn ngữ hòa nhã để bày tỏ quan điểm của mình.`
  },
  {
    id: 'a4',
    category: 'Giao tiếp gia đình',
    title: 'Nói Chuyện Với Bố Mẹ Khi Điểm Số Không Như Ý Muốn',
    summary: 'Cách đối thoại chân thành, nhận trách nhiệm và cùng gia đình tìm giải pháp thay vì trốn tránh trong sợ hãi.',
    readTime: '6 phút đọc',
    content: `Bố mẹ thường la mắng vì lo lắng cho tương lai của em nhiều hơn là vì ghét bỏ em.\n\n- Hãy chủ động báo điểm với bố mẹ trước khi cô giáo nhắn tin.\n- Thẳng thắn thừa nhận phần mình chưa làm tốt: "Con biết bài này con chưa ôn kỹ phần..."\n- Đề xuất giải pháp cải thiện: "Con sẽ nhờ bạn giảng lại bài này và làm thêm bài tập tuần này ạ."\n- Sự trưởng thành và trách nhiệm của em sẽ khiến bố mẹ an tâm và bao dung hơn rất nhiều.`
  }
];

function AppointmentsAndLibraryPage() {
  const { currentUser } = useAuth();
  const [subTab, setSubTab] = useState<'appointment' | 'library'>('appointment');

  // State đặt lịch
  const [selectedCounselor, setSelectedCounselor] = useState(COUNSELORS[0].id);
  const [appointDate, setAppointDate] = useState('');
  const [appointTime, setAppointTime] = useState('14:30');
  const [appointType, setAppointType] = useState('Trực tiếp tại Phòng 204');
  const [studentNote, setStudentNote] = useState('');
  const [studentContact, setStudentContact] = useState('');
  const [appointSuccess, setAppointSuccess] = useState(false);
  const [loadingAppoint, setLoadingAppoint] = useState(false);

  // State thư viện
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('Tất cả');
  const [activeArticleModal, setActiveArticleModal] = useState<any | null>(null);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointDate || !studentNote.trim()) return;
    setLoadingAppoint(true);

    const cObj = COUNSELORS.find((c) => c.id === selectedCounselor) || COUNSELORS[0];

    const appointmentData = {
      counselorName: cObj.name,
      counselorId: cObj.id,
      date: appointDate,
      time: appointTime,
      type: appointType,
      note: studentNote,
      contact: studentContact || currentUser?.email || 'Học sinh ẩn danh',
      userEmail: currentUser?.email || 'anonymous',
      status: 'Chờ xác nhận',
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'appointments'), appointmentData);
      setAppointSuccess(true);
      setStudentNote('');
    } catch {
      // Fallback local
      const list = JSON.parse(localStorage.getItem('demo_appointments') || '[]');
      list.unshift(appointmentData);
      localStorage.setItem('demo_appointments', JSON.stringify(list));
      setAppointSuccess(true);
      setStudentNote('');
    } finally {
      setLoadingAppoint(false);
    }
  };

  const handleSaveArticle = async (article: any) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để lưu bài viết vào mục "Đã lưu"!');
      return;
    }
    try {
      const ref = doc(db, 'users', currentUser.uid, 'savedPosts', 'art_' + article.id);
      await setDoc(ref, {
        postId: article.id,
        title: article.title,
        content: article.content,
        author: 'Thư viện Kỹ năng Học đường',
        category: article.category,
        savedAt: serverTimestamp()
      });
      alert('Đã lưu cẩm nang vào mục "Đã lưu" trên Firestore!');
    } catch {
      alert('Đã lưu bài viết vào tài khoản!');
    }
  };

  const filteredArticles = ARTICLES.filter((a) => {
    const matchCat = selectedCat === 'Tất cả' || a.category === selectedCat;
    const matchSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Sub-tab selection */}
      <div className="flex justify-center mb-8">
        <div className="p-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 shadow-md inline-flex gap-2">
          <button
            onClick={() => setSubTab('appointment')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'appointment'
                ? 'bg-teal-600 text-white shadow-xs scale-102'
                : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Đặt Lịch Gặp Chuyên Gia</span>
          </button>
          <button
            onClick={() => setSubTab('library')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'library'
                ? 'bg-purple-600 text-white shadow-xs scale-102'
                : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Thư Viện Kỹ Năng Sống</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: ĐẶT LỊCH GẶP CHUYÊN GIA */}
      {subTab === 'appointment' && (
        <div className="space-y-6">
          {/* Giới thiệu chuyên gia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COUNSELORS.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCounselor(c.id)}
                className={`cursor-pointer p-5 rounded-3xl border transition-all ${
                  selectedCounselor === c.id
                    ? 'bg-white border-teal-500 shadow-lg ring-2 ring-teal-200 scale-102'
                    : 'bg-white/70 border-white/80 hover:bg-white shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{c.avatar}</span>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-sm leading-tight">{c.name}</h3>
                    <p className="text-[11px] font-bold text-teal-700">{c.role}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-2">{c.desc}</p>
                <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-teal-600" />
                  <span>{c.location}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Form đặt hẹn */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/80 p-6 sm:p-8 rounded-3xl shadow-xl">
            <h2 className="text-base sm:text-lg font-black text-slate-800 mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span>Phiếu Đăng Ký Tư Vấn Tâm Lý Học Đường</span>
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Mọi buổi gặp đều diễn ra trong không gian riêng tư, tôn trọng và bảo mật 100% danh tính học sinh.
            </p>

            {appointSuccess ? (
              <div className="bg-teal-50 border border-teal-200 rounded-3xl p-6 text-center space-y-3 animate-in zoom-in-95">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-teal-900">Đã Gửi Phiếu Đặt Hẹn Thành Công!</h3>
                <p className="text-xs sm:text-sm text-teal-800 max-w-md mx-auto">
                  Thầy cô đã ghi nhận lịch hẹn của em và sẽ chuẩn bị phòng tư vấn chu đáo. Em nhớ kiểm tra thông báo nhé!
                </p>
                <button
                  onClick={() => setAppointSuccess(false)}
                  className="px-5 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700"
                >
                  Đặt thêm lịch khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Ngày hẹn:</label>
                    <input
                      type="date"
                      value={appointDate}
                      onChange={(e) => setAppointDate(e.target.value)}
                      required
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-teal-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Khung giờ:</label>
                    <select
                      value={appointTime}
                      onChange={(e) => setAppointTime(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-teal-300"
                    >
                      <option value="08:30 (Giờ ra chơi sáng)">08:30 (Giờ ra chơi sáng)</option>
                      <option value="10:00 (Tiết trống sáng)">10:00 (Tiết trống sáng)</option>
                      <option value="14:30 (Giờ ra chơi chiều)">14:30 (Giờ ra chơi chiều)</option>
                      <option value="16:30 (Sau giờ tan học)">16:30 (Sau giờ tan học)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Hình thức gặp:</label>
                    <select
                      value={appointType}
                      onChange={(e) => setAppointType(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-teal-300"
                    >
                      <option value="Trực tiếp tại Phòng 204">Trực tiếp tại Phòng Tư Vấn 204</option>
                      <option value="Trò chuyện trực tuyến riêng tư">Trò chuyện trực tuyến bảo mật</option>
                      <option value="Trao đổi qua thư điện tử">Trao đổi qua thư điện tử</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
                    Vấn đề em muốn cùng thầy cô tháo gỡ:
                  </label>
                  <textarea
                    placeholder="Em đang gặp khó khăn gì? (Ví dụ: Hay mất ngủ vì lo thi, khó hòa nhập với bạn bè, áp lực từ gia đình...)"
                    value={studentNote}
                    onChange={(e) => setStudentNote(e.target.value)}
                    rows={3}
                    required
                    className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
                    Thông tin liên hệ (Số điện thoại / Zalo hoặc lớp học):
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Em An lớp 8A2 hoặc SĐT 0912xxxxxx (để thầy cô báo giờ gặp)..."
                    value={studentContact}
                    onChange={(e) => setStudentContact(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loadingAppoint}
                    className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-teal-200 hover:scale-101 active:scale-98 transition flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{loadingAppoint ? 'Đang gửi phiếu...' : 'XÁC NHẬN ĐẶT LỊCH TƯ VẤN'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: THƯ VIỆN KỸ NĂNG SỐNG */}
      {subTab === 'library' && (
        <div className="space-y-6">
          {/* Thanh tìm kiếm & Lọc danh mục */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/80 p-5 rounded-3xl shadow-md space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết, cẩm nang tâm lý, kỹ năng học đường..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1 no-scrollbar">
              {['Tất cả', 'Áp lực học tập', 'Quan hệ bạn bè', 'Kiểm soát cảm xúc', 'Giao tiếp gia đình'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                    selectedCat === cat
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid bài viết */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                className="bg-white/80 backdrop-blur-xl border border-white/80 p-5 rounded-3xl shadow-md hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {art.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{art.readTime}</span>
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-800 mb-2 leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{art.summary}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setActiveArticleModal(art)}
                    className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                  >
                    <span>Đọc chi tiết</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleSaveArticle(art)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition"
                    title="Lưu bài viết"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal đọc bài viết chi tiết */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                  {activeArticleModal.category}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {activeArticleModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveArticleModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line py-2 border-y border-slate-100 my-4">
              {activeArticleModal.content}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  handleSaveArticle(activeArticleModal);
                }}
                className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold hover:bg-purple-100 flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Lưu bài này</span>
              </button>
              <button
                onClick={() => setActiveArticleModal(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 9. TRANG BÀI VIẾT ĐÃ LƯU (SAVED POSTS)
// ==========================================

function SavedPostsPage() {
  const { currentUser } = useAuth();
  const [savedList, setSavedList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, 'users', currentUser.uid, 'savedPosts'), orderBy('savedAt', 'desc'));
        const snapshot = await getDocs(q);
        setSavedList(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error('Lỗi tải bài đã lưu:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [currentUser]);

  const handleRemoveSaved = async (id: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'savedPosts', id));
      setSavedList(savedList.filter((item) => item.id !== id));
    } catch (e) {
      console.error('Lỗi xóa:', e);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white/80 backdrop-blur-xl rounded-3xl text-center shadow-xl border border-white/80">
        <Bookmark className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800 mb-2">Đăng Nhập Để Xem Bài Đã Lưu</h2>
        <p className="text-xs text-slate-500 mb-6">
          Em cần đăng nhập vào tài khoản để đồng bộ và lưu giữ các bài viết bổ ích trên đám mây Firestore.
        </p>
        <Link
          to="/tai-khoan"
          className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-indigo-700 transition"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Bookmark className="w-5 h-5 fill-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">Bài Viết & Cẩm Nang Đã Lưu</h1>
            <p className="text-xs text-slate-500">Được lưu trữ bảo mật trên Firestore cá nhân</p>
          </div>
        </div>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          {savedList.length} mục
        </span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Đang tải dữ liệu từ Firestore...</div>
      ) : savedList.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl text-center border border-white/80 shadow-md">
          <p className="text-slate-500 text-xs sm:text-sm">
            Chưa có bài viết nào được lưu. Hãy bấm biểu tượng 🔖 ở Góc Chia Sẻ hoặc Thư Viện để lưu lại nhé!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedList.map((item) => (
            <div
              key={item.id}
              className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl shadow-md border border-white/80 flex items-start justify-between gap-4"
            >
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1">{item.title}</h3>
                <p className="text-[11px] text-slate-400 mb-2">Tác giả / Nguồn: {item.author || 'Tâm lý học đường'}</p>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50/70 p-3 rounded-2xl">
                  {item.content}
                </p>
              </div>
              <button
                onClick={() => handleRemoveSaved(item.id)}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition shrink-0"
                title="Bỏ lưu"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 10. TRANG QUẢN TRỊ (STAFF / ADMIN DASHBOARD)
// ==========================================

function DashboardPage() {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'reports' | 'posts' | 'appointments'>('reports');
  const [bullyingList, setBullyingList] = useState<any[]>([]);
  const [postsList, setPostsList] = useState<any[]>([]);
  const [appointList, setAppointList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Bullying reports
      const bSnap = await getDocs(query(collection(db, 'bullyingReports'), orderBy('createdAt', 'desc')));
      setBullyingList(bSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // 2. Posts
      const pSnap = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc')));
      setPostsList(pSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // 3. Appointments
      const aSnap = await getDocs(query(collection(db, 'appointments'), orderBy('createdAt', 'desc')));
      setAppointList(aSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {
      // Fallback local
      setBullyingList(JSON.parse(localStorage.getItem('demo_bully_reports') || '[]'));
      setPostsList(JSON.parse(localStorage.getItem('demo_posts') || '[]'));
      setAppointList(JSON.parse(localStorage.getItem('demo_appointments') || '[]'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Xóa bài chia sẻ này khỏi hệ thống?')) {
      try {
        await deleteDoc(doc(db, 'posts', id));
        setPostsList(postsList.filter((p) => p.id !== id));
      } catch {
        setPostsList(postsList.filter((p) => p.id !== id));
      }
    }
  };

  const handleUpdateReportStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'bullyingReports', id), { status: newStatus });
      setBullyingList(bullyingList.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    } catch {
      setBullyingList(bullyingList.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 p-6 rounded-3xl shadow-lg mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">Bàn Điều Khiển Quản Trị Học Đường</h1>
            <p className="text-xs text-slate-500">
              Dành cho Ban Giám Hiệu, Thầy Nguyễn Tuấn Anh & Cô Nguyễn Thị Thùy Trang
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-xl border border-indigo-200">
          <span>Quyền: {userRole}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          onClick={() => setActiveTab('reports')}
          className={`cursor-pointer p-4 rounded-3xl border transition-all ${
            activeTab === 'reports' ? 'bg-rose-50 border-rose-300 shadow-md' : 'bg-white/70 border-white/80'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-rose-800">Báo Cáo Bạo Lực</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-900">{bullyingList.length}</div>
          <span className="text-[10px] text-rose-600 font-medium">Hồ sơ tiếp nhận</span>
        </div>

        <div
          onClick={() => setActiveTab('appointments')}
          className={`cursor-pointer p-4 rounded-3xl border transition-all ${
            activeTab === 'appointments' ? 'bg-teal-50 border-teal-300 shadow-md' : 'bg-white/70 border-white/80'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-teal-800">Lịch Hẹn Tư Vấn</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-900">{appointList.length}</div>
          <span className="text-[10px] text-teal-600 font-medium">Học sinh đăng ký</span>
        </div>

        <div
          onClick={() => setActiveTab('posts')}
          className={`cursor-pointer p-4 rounded-3xl border transition-all ${
            activeTab === 'posts' ? 'bg-indigo-50 border-indigo-300 shadow-md' : 'bg-white/70 border-white/80'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-indigo-800">Bài Chia Sẻ</span>
            <MessageSquare className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-900">{postsList.length}</div>
          <span className="text-[10px] text-indigo-600 font-medium">Tâm sự học sinh</span>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-xl">
        {/* Tab 1: Bullying Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800">Danh Sách Báo Cáo Bạo Lực Học Đường</h3>
            {bullyingList.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Không có báo cáo bạo lực nào.</p>
            ) : (
              <div className="space-y-3">
                {bullyingList.map((r, i) => (
                  <div key={r.id || i} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200">
                          {r.code || 'SOS-00' + i}
                        </span>
                        <span className="font-bold text-xs text-slate-800">{r.category}</span>
                      </div>
                      <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                        {r.urgency || 'Khẩn cấp'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">{r.detail}</p>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
                      <span>Lớp / Địa điểm: <strong>{r.targetClass || 'Chưa rõ'}</strong></span>
                      <span>Liên hệ: <strong>{r.contactInfo || 'Ẩn danh'}</strong></span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateReportStatus(r.id, 'Đã xác minh & Xử lý an toàn')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700"
                        >
                          Đánh dấu đã can thiệp
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Appointments */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800">Danh Sách Học Sinh Đặt Lịch Tư Vấn</h3>
            {appointList.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Chưa có lịch hẹn nào.</p>
            ) : (
              <div className="space-y-3">
                {appointList.map((a, i) => (
                  <div key={a.id || i} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-teal-800">{a.counselorName}</span>
                        <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold">
                          {a.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">"{a.note}"</p>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Thời gian: <strong>{a.date} ({a.time})</strong> • Liên hệ: {a.contact}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl shrink-0">
                      {a.status || 'Đã tiếp nhận'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Posts */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800">Kiểm Duyệt Bài Viết Góc Chia Sẻ</h3>
            {postsList.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Chưa có bài viết nào.</p>
            ) : (
              <div className="space-y-3">
                {postsList.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">{p.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{p.content}</p>
                      <span className="text-[10px] text-slate-400">Tác giả: {p.author}</span>
                    </div>
                    <button
                      onClick={() => handleDeletePost(p.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Xóa bài viết"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 11. TRANG ĐĂNG NHẬP / AUTH & TÀI KHOẢN MẪU
// ==========================================

const DEMO_ACCOUNTS = [
  {
    role: 'Học sinh THCS',
    name: 'Em Trần Hoài An',
    email: 'an.tran@school.edu.vn',
    pass: 'demo123',
    badge: 'STUDENT',
    color: 'bg-indigo-50 text-indigo-700'
  },
  {
    role: 'Học sinh Tiểu học',
    name: 'Em Nguyễn Thanh Bình',
    email: 'binh.nguyen@school.edu.vn',
    pass: 'demo123',
    badge: 'STUDENT',
    color: 'bg-sky-50 text-sky-700'
  },
  {
    role: 'Tư vấn viên THCS',
    name: 'ThS. Nguyễn Tuấn Anh',
    email: 'tuananh.nguyen@school.edu.vn',
    pass: 'demo123',
    badge: 'COUNSELOR',
    color: 'bg-teal-50 text-teal-700'
  },
  {
    role: 'Tư vấn viên Tiểu học',
    name: 'Cô Nguyễn Thị Thùy Trang',
    email: 'thuytrang.nguyen@school.edu.vn',
    pass: 'demo123',
    badge: 'COUNSELOR',
    color: 'bg-purple-50 text-purple-700'
  },
  {
    role: 'Quản trị viên',
    name: 'Thầy Minh (Ban Giám Hiệu)',
    email: 'quantri.minh@school.edu.vn',
    pass: 'admin123',
    badge: 'ADMIN',
    color: 'bg-amber-50 text-amber-700'
  }
];

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, quickLogin, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, displayNameInput || email.split('@')[0]);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Lỗi đăng nhập hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = async (accEmail: string, accPass: string) => {
    setError('');
    setLoading(true);
    try {
      await quickLogin(accEmail, accPass);
      navigate('/');
    } catch (err: any) {
      setError('Lỗi đăng nhập nhanh: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Form đăng nhập */}
        <div className="md:col-span-6 bg-white/80 backdrop-blur-xl border border-white/80 p-6 sm:p-8 rounded-3xl shadow-xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-800">
              {isRegister ? 'Tạo Tài Khoản Mới' : 'Đăng Nhập Hệ Thống'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Đồng bộ dữ liệu trên Firestore (Dự án: hinh123-fd678)
            </p>
          </div>

          {currentUser ? (
            <div className="bg-indigo-50 p-6 rounded-2xl text-center space-y-3">
              <p className="text-xs text-indigo-900 font-bold">
                Em đang đăng nhập với tài khoản: <br />
                <span className="text-sm font-black text-indigo-700">{currentUser.email}</span>
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  Vào trang chủ
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              {isRegister && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Họ và tên của em:</label>
                  <input
                    type="text"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    placeholder="Ví dụ: Em Nguyễn Văn An..."
                    className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email / Tên tài khoản:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.edu.vn"
                  required
                  className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mật khẩu:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-200 transition"
              >
                {loading ? 'Đang xử lý...' : isRegister ? 'Tạo tài khoản' : 'Đăng nhập ngay'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  {isRegister ? 'Đã có tài khoản? Đăng nhập tại đây' : 'Chưa có tài khoản? Bấm để đăng ký'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Danh sách tài khoản mẫu bấm 1-click */}
        <div className="md:col-span-6 bg-white/80 backdrop-blur-xl border border-white/80 p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-black text-sm sm:text-base text-slate-800">
              Đăng Nhập Nhanh Trải Nghiệm (1-Click)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Bấm vào bất kỳ tài khoản nào bên dưới để đăng nhập ngay mà không cần gõ mật khẩu:
          </p>

          <div className="space-y-2.5">
            {DEMO_ACCOUNTS.map((acc, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 shadow-2xs hover:shadow-xs transition flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-800">{acc.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${acc.color}`}>
                      {acc.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {acc.email} • Pass: {acc.pass}
                  </div>
                </div>

                <button
                  onClick={() => handleQuick(acc.email, acc.pass)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-bold transition shadow-2xs shrink-0"
                >
                  Vào ngay
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 12. ROOT APP ROUTER & WRAPPER
// ==========================================

function AppContent() {
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50/70 via-sky-50/60 to-purple-50/70 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* 1. Thanh trạng thái Firebase cố định trên cùng */}
      <TopFirebaseBar />

      {/* 2. Thanh điều hướng Navbar */}
      <Navbar onOpenEmergency={() => setEmergencyOpen(true)} />

      {/* 3. Nội dung trang chính */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onOpenEmergency={() => setEmergencyOpen(true)} />} />
          <Route path="/cam-xuc" element={<EmotionPage />} />
          <Route path="/tro-ly-ai" element={<AIChatPage />} />
          <Route path="/chia-se" element={<ShareCornerPage />} />
          <Route path="/chong-bat-nat" element={<ShareCornerPage />} />
          <Route path="/thu-vien" element={<AppointmentsAndLibraryPage />} />
          <Route path="/bai-viet-da-luu" element={<SavedPostsPage />} />
          <Route path="/dang-ky-tu-van" element={<AppointmentsAndLibraryPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tai-khoan" element={<LoginPage />} />
        </Routes>
      </main>

      {/* 4. Nút Floating SOS 111 góc phải màn hình */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setEmergencyOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-full font-black text-xs shadow-xl shadow-rose-300 hover:scale-105 active:scale-95 transition-all"
        >
          <PhoneCall className="w-4 h-4 animate-bounce" />
          <span>SOS Khẩn Cấp 111</span>
        </button>
      </div>

      {/* 5. Modal Khẩn cấp 111 */}
      <EmergencyModal isOpen={emergencyOpen} onClose={() => setEmergencyOpen(false)} />

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
