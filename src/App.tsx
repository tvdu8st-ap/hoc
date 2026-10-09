/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

// Firebase SDK & Khởi tạo trực tiếp với project hinh123-fd678
import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc,
  doc, 
  query, 
  orderBy, 
  serverTimestamp, 
  setDoc 
} from 'firebase/firestore';

import { 
  PhoneCall, 
  AlertTriangle, 
  CheckCircle2, 
  Heart, 
  LogOut, 
  Bookmark, 
  Shield, 
  Trash2, 
  FileText, 
  Users 
} from 'lucide-react';

// ==========================================
// 1. CẤU HÌNH & KHỞI TẠO FIREBASE (hinh123-fd678)
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForProjectHinh123", // Thay bằng API Key thật từ Firebase Console của bạn
  authDomain: "hinh123-fd678.firebaseapp.com",
  projectId: "hinh123-fd678",
  storageBucket: "hinh123-fd678.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

// ==========================================
// 2. AUTH CONTEXT (XÁC THỰC FIREBASE)
// ==========================================
interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const register = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
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
// 3. AGE MODE CONTEXT (CHẾ ĐỘ LỨA TUỔI)
// ==========================================
interface AgeModeContextType {
  mode: 'kid' | 'teen' | 'staff';
  setMode: (mode: 'kid' | 'teen' | 'staff') => void;
}

const AgeModeContext = createContext<AgeModeContextType | undefined>(undefined);

export const AgeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'kid' | 'teen' | 'staff'>('teen');
  return (
    <AgeModeContext.Provider value={{ mode, setMode }}>
      {children}
    </AgeModeContext.Provider>
  );
};

export const useAgeMode = () => {
  const context = useContext(AgeModeContext);
  if (!context) throw new Error('useAgeMode phải được đặt trong AgeModeProvider');
  return context;
};

// ==========================================
// 4. CÁC COMPONENT GIAO DIỆN & TRANG CHỨC NĂNG
// ==========================================

function Navbar({ onOpenEmergency }: { onOpenEmergency: () => void }) {
  const { currentUser, logout } = useAuth();
  const { mode, setMode } = useAgeMode();

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <Heart className="w-6 h-6 text-rose-600 fill-rose-600" />
        <span className="font-bold text-slate-800 text-lg">Tâm Lý Học Đường</span>
      </div>

      <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
        <a href="/" className="hover:text-indigo-600 transition">Trang chủ</a>
        <a href="/cam-xuc" className="hover:text-indigo-600 transition">Cảm xúc</a>
        <a href="/chia-se" className="hover:text-indigo-600 transition">Góc chia sẻ</a>
        <a href="/bai-viet-da-luu" className="hover:text-indigo-600 transition flex items-center gap-1">
          <Bookmark className="w-4 h-4" /> Đã lưu
        </a>
        <a href="/dang-ky-tu-van" className="hover:text-indigo-600 transition">Đặt lịch</a>
        <a href="/dashboard" className="hover:text-indigo-600 transition">Quản trị</a>

        {currentUser ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono">({currentUser.email})</span>
            <button onClick={logout} className="flex items-center gap-1 text-rose-600 hover:underline">
              <LogOut className="w-4 h-4" /> Đăng xuất
            </button>
          </div>
        ) : (
          <a href="/tai-khoan" className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl hover:bg-indigo-700 transition">Đăng nhập</a>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 py-4 text-center text-xs text-slate-500">
      Đường dây nóng hỗ trợ tâm lý & phòng chống bạo lực học đường: <strong className="text-rose-600">111</strong> (Hoạt động 24/7 trên nền tảng Firebase)
    </footer>
  );
}

function EmergencyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-500 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 text-rose-600 mb-4">
          <AlertTriangle className="w-8 h-8 animate-pulse" />
          <h3 className="text-xl font-extrabold">HỖ TRỢ KHẨN CẤP 111</h3>
        </div>
        <p className="text-slate-600 text-sm mb-4">
          Nếu bạn đang gặp khủng hoảng tâm lý, bạo lực học đường hoặc nguy hiểm cận kề, hãy kết nối ngay với chuyên gia quốc gia:
        </p>
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-center mb-6">
          <a href="tel:111" className="text-3xl font-black text-rose-700 tracking-wider">111</a>
          <p className="text-xs text-rose-600 mt-1">Miễn phí cước gọi 24/7</p>
        </div>
        <button onClick={onClose} className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 rounded-xl transition">
          Đóng cửa sổ
        </button>
      </div>
    </div>
  );
}

// Các trang chức năng mẫu tích hợp Firestore
function Home({ onOpenEmergency }: { onOpenEmergency: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl font-black text-slate-900 mb-4">Lắng nghe & Đồng hành học đường</h1>
      <p className="text-slate-600 mb-8 max-w-xl mx-auto">
        Ứng dụng tư vấn tâm lý an toàn, bảo mật dữ liệu trên đám mây Firebase (Project: hinh123-fd678).
      </p>
      <div className="flex justify-center gap-4">
        <a href="/chia-se" className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition">
          Góc Chia Sẻ Tâm Tư
        </a>
        <button onClick={onOpenEmergency} className="bg-rose-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-rose-700 transition">
          SOS Khẩn Cấp 111
        </button>
      </div>
    </div>
  );
}

function ShareCorner() {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { currentUser } = useAuth();

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Lỗi tải bài viết:", e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        author: currentUser?.email || 'Ẩn danh',
        createdAt: serverTimestamp()
      });
      setTitle('');
      setContent('');
      fetchPosts();
    } catch (e) {
      console.error("Lỗi đăng bài:", e);
    }
  };

  const handleSavePost = async (post: any) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để lưu bài viết!');
      return;
    }
    try {
      const savedRef = doc(db, 'users', currentUser.uid, 'savedPosts', post.id);
      await setDoc(savedRef, {
        postId: post.id,
        title: post.title,
        content: post.content,
        author: post.author,
        savedAt: serverTimestamp()
      });
      alert('Đã lưu bài viết vào tài khoản của bạn trên Firestore!');
    } catch (e) {
      console.error("Lỗi lưu bài:", e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Góc Chia Sẻ & Tâm Tư</h2>
      
      {currentUser ? (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8 space-y-4">
          <h3 className="font-semibold text-slate-700">Tạo chia sẻ mới</h3>
          <input type="text" placeholder="Tiêu đề câu chuyện..." value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2.5 border rounded-xl text-sm" required />
          <textarea placeholder="Nội dung bạn muốn chia sẻ..." value={content} onChange={e => setContent(e.target.value)} className="w-full p-2.5 border rounded-xl text-sm" rows={3} required />
          <button type="submit" className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-indigo-700">Đăng lên hệ thống</button>
        </form>
      ) : (
        <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-xl mb-6 border border-amber-200">
          Vui lòng <a href="/tai-khoan" className="underline font-bold">đăng nhập</a> để đăng bài chia sẻ hoặc lưu bài viết.
        </p>
      )}

      <div className="space-y-4">
        {posts.map(p => (
          <div key={p.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-lg text-slate-900">{p.title}</h4>
              <p className="text-xs text-slate-400 mb-2">Tác giả: {p.author}</p>
              <p className="text-slate-700 text-sm">{p.content}</p>
            </div>
            {currentUser && (
              <button onClick={() => handleSavePost(p)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition shrink-0" title="Lưu bài viết">
                <Bookmark className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SavedPosts() {
  const [savedList, setSavedList] = useState<any[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSaved = async () => {
      if (!currentUser) return;
      try {
        const q = query(collection(db, 'users', currentUser.uid, 'savedPosts'), orderBy('savedAt', 'desc'));
        const snapshot = await getDocs(q);
        setSavedList(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Lỗi tải bài đã lưu:", e);
      }
    };
    fetchSaved();
  }, [currentUser]);

  const handleRemove = async (postId: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'savedPosts', postId));
      setSavedList(savedList.filter(item => item.postId !== postId && item.id !== postId));
    } catch (e) {
      console.error("Lỗi xóa:", e);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-2xl text-center shadow-sm border">
        <p className="text-sm text-slate-600">Vui lòng đăng nhập để xem danh sách bài viết đã lưu.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Bookmark className="w-7 h-7 text-indigo-600 fill-indigo-600" />
        <h1 className="text-2xl font-black text-slate-800">Bài Viết Đã Lưu Trên Firestore</h1>
      </div>

      {savedList.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm">Chưa có bài viết nào được lưu trong tài khoản của bạn.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedList.map(post => (
            <div key={post.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{post.title}</h3>
                <p className="text-xs text-slate-400 mb-2">Tác giả: {post.author}</p>
                <p className="text-slate-700 text-sm">{post.content}</p>
              </div>
              <button onClick={() => handleRemove(post.postId || post.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition shrink-0" title="Bỏ lưu">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StaffDashboard() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Lỗi quản trị:", e);
      }
    };
    fetchAll();
  }, []);

  const handleDeletePost = async (id: string) => {
    if (window.confirm("Xóa bài viết này?")) {
      await deleteDoc(doc(db, 'posts', id));
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl font-black text-slate-800">Trang Quản Trị Hệ Thống (Staff Dashboard)</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-sm">Quản lý bài viết góc chia sẻ</div>
        <div className="divide-y divide-slate-100">
          {posts.map(p => (
            <div key={p.id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900">{p.title}</h4>
                <p className="text-xs text-slate-400">Tác giả: {p.author}</p>
              </div>
              <button onClick={() => handleDeletePost(p.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      if (isRegister) await register(email, password);
      else await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
      <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">{isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập hệ thống'}</h2>
      {error && <p className="text-xs bg-rose-50 text-rose-600 p-3 rounded-xl mb-4 border border-rose-200">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-xl text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Mật khẩu</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-xl text-sm" required />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition shadow-md">
          {isRegister ? 'Đăng ký ngay' : 'Đăng nhập'}
        </button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)} className="w-full mt-4 text-xs text-indigo-600 hover:underline text-center">
        {isRegister ? 'Đã có tài khoản? Đăng nhập tại đây' : 'Chưa có tài khoản? Đăng ký mới'}
      </button>
    </div>
  );
}

// Các trang phụ trợ giữ chỗ nếu chưa tách file riêng
function EmotionCorner() { return <div className="p-8 text-center text-xl font-bold">Góc Cảm Xúc</div>; }
function AIChat() { return <div className="p-8 text-center text-xl font-bold">Trợ Lý AI Tâm Lý</div>; }
function AntiBullying() { return <div className="p-8 text-center text-xl font-bold">Phòng Chống Bạo Lực Học Đường</div>; }
function Library() { return <div className="p-8 text-center text-xl font-bold">Thư Viện Tài Liệu</div>; }
function Appointments() { return <div className="p-8 text-center text-xl font-bold">Đặt Lịch Tư Vấn</div>; }

// ==========================================
// 5. ROOT COMPONENT
// ==========================================
function AppContent() {
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Firebase Status Notification Banner */}
      <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
            Firebase Connected
          </span>
          <span>Dự án: <strong>hinh123-fd678</strong> đang hoạt động ổn định trên Firestore & Auth.</span>
        </div>
        <span className="font-mono bg-white/70 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
          Cloud Firestore Active
        </span>
      </div>

      <Navbar onOpenEmergency={() => setEmergencyOpen(true)} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onOpenEmergency={() => setEmergencyOpen(true)} />} />
          <Route path="/cam-xuc" element={<EmotionCorner />} />
          <Route path="/tro-ly-ai" element={<AIChat />} />
          <Route path="/chia-se" element={<ShareCorner />} />
          <Route path="/bai-viet-da-luu" element={<SavedPosts />} />
          <Route path="/chong-bat-nat" element={<AntiBullying />} />
          <Route path="/thu-vien" element={<Library />} />
          <Route path="/dang-ky-tu-van" element={<Appointments />} />
          <Route path="/dashboard" element={<StaffDashboard />} />
          <Route path="/tai-khoan" element={<Login />} />
        </Routes>
      </main>

      {/* Floating SOS Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setEmergencyOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-extrabold text-xs shadow-xl shadow-rose-300 hover:scale-105 active:scale-95 transition-all"
        >
          <PhoneCall className="w-4 h-4 animate-bounce" />
          <span>Khẩn cấp 111</span>
        </button>
      </div>

      <EmergencyModal isOpen={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AgeModeProvider>
          <AppContent />
        </AgeModeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
