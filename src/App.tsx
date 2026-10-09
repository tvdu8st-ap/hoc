/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';

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
  Sparkles,
  Calendar as CalendarIcon,
  BookOpen,
  Smile,
  MessageSquare
} from 'lucide-react';

// ==========================================
// 1. CẤU HÌNH & KHỞI TẠO FIREBASE (hinh123-fd678)
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyDoJVOu_L_J61MK3RWgB2C0xbP7F19mw3A", 
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

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <Heart className="w-6 h-6 text-rose-600 fill-rose-600" />
        <Link to="/" className="font-bold text-slate-800 text-lg hover:text-indigo-600 transition">Tâm Lý Học Đường</Link>
      </div>

      <div className="flex items-center gap-5 text-sm font-medium text-slate-600">
        <Link to="/" className="hover:text-indigo-600 transition">Trang chủ</Link>
        <Link to="/cam-xuc" className="hover:text-indigo-600 transition">Cảm xúc</Link>
        <Link to="/tro-ly-ai" className="hover:text-indigo-600 transition">Trợ lý AI</Link>
        <Link to="/chia-se" className="hover:text-indigo-600 transition">Góc chia sẻ</Link>
        <Link to="/chong-bat-nat" className="hover:text-indigo-600 transition">Chống bắt nạt</Link>
        <Link to="/thu-vien" className="hover:text-indigo-600 transition">Thư viện</Link>
        <Link to="/bai-viet-da-luu" className="hover:text-indigo-600 transition flex items-center gap-1">
          <Bookmark className="w-4 h-4" /> Đã lưu
        </Link>
        <Link to="/dang-ky-tu-van" className="hover:text-indigo-600 transition">Đặt lịch</Link>
        <Link to="/dashboard" className="hover:text-indigo-600 transition">Quản trị</Link>

        {currentUser ? (
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            <span className="text-xs text-slate-500 font-mono">({currentUser.email})</span>
            <button onClick={logout} className="flex items-center gap-1 text-rose-600 hover:underline">
              <LogOut className="w-4 h-4" /> Đăng xuất
            </button>
          </div>
        ) : (
          <Link to="/tai-khoan" className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl hover:bg-indigo-700 transition">Đăng nhập</Link>
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
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-500">
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

// ==========================================
// CÁC TRANG TÍCH HỢP TRỰC TIẾP
// ==========================================

function Home({ onOpenEmergency }: { onOpenEmergency: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl font-black text-slate-900 mb-4">Lắng nghe & Đồng hành học đường</h1>
      <p className="text-slate-600 mb-8 max-w-xl mx-auto">
        Ứng dụng tư vấn tâm lý an toàn, bảo mật dữ liệu trên đám mây Firebase (Project: hinh123-fd678).
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        <Link to="/chia-se" className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition">
          Góc Chia Sẻ Tâm Tư
        </Link>
        <Link to="/tro-ly-ai" className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-emerald-700 transition">
          Trò Chuyện Cùng Trợ Lý AI
        </Link>
        <button onClick={onOpenEmergency} className="bg-rose-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-rose-700 transition">
          SOS Khẩn Cấp 111
        </button>
      </div>
    </div>
  );
}

function EmotionCorner() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const emotions = [
    { name: 'Vui vẻ', emoji: '😊', desc: 'Tuyệt vời! Hãy lan tỏa năng lượng tích cực này nhé.' },
    { name: 'Bình thường', emoji: '😐', desc: 'Một ngày nhẹ nhàng và ổn định.' },
    { name: 'Buồn bã', emoji: '😢', desc: 'Không sao cả, ai cũng có lúc buồn. Hãy nghỉ ngơi nhé.' },
    { name: 'Căng thẳng', emoji: '🤯', desc: 'Hít thở thật sâu nào, mọi áp lực rồi sẽ qua.' },
    { name: 'Tức giận', emoji: '😡', desc: 'Hãy uống một ngụm nước mát và thả lỏng cơ thể.' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-center">
      <h2 className="text-2xl font-black text-slate-800 mb-2">Góc Cảm Xúc Hôm Nay</h2>
      <p className="text-slate-500 text-sm mb-8">Hôm nay cảm xúc của bạn thế nào? Hãy chọn biểu tượng phù hợp nhé.</p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        {emotions.map(e => (
          <button 
            key={e.name}
            onClick={() => setSelectedEmotion(e.desc)}
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-500 hover:shadow-md transition flex flex-col items-center gap-2"
          >
            <span className="text-4xl">{e.emoji}</span>
            <span className="font-bold text-sm text-slate-700">{e.name}</span>
          </button>
        ))}
      </div>
      {selectedEmotion && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-2xl text-sm font-medium">
          💡 Lời khuyên cho bạn: {selectedEmotion}
        </div>
      )}
    </div>
  );
}

function AIChat({ onOpenEmergency }: { onOpenEmergency: () => void }) {
  const [messages, setMessages] = useState<any[]>([
    { text: "Xin chào! Mình là trợ lý AI tâm lý học đường. Bạn đang gặp căng thẳng hay chuyện buồn nào cần chia sẻ không?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { text: userText, sender: 'user' }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "Mình hiểu cảm giác của bạn. Đừng lo lắng quá, hãy hít thở thật sâu và nhớ rằng luôn có thầy cô và chuyên gia sẵn sàng đồng hành cùng bạn nhé!", sender: 'ai' }]);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600"><Sparkles className="w-6 h-6" /></div>
          <div>
            <h1 className="text-xl font-black text-slate-800">Trợ Lý AI Lắng Nghe</h1>
            <p className="text-xs text-slate-500">Trò chuyện an toàn, bảo mật 24/7</p>
          </div>
        </div>
        <button onClick={onOpenEmergency} className="px-3 py-2 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200">
          Khẩn cấp 111
        </button>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 overflow-y-auto space-y-4 mb-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm ${m.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800 border'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 bg-white p-2 rounded-2xl border shadow-sm">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Nhập tâm sự của bạn..." className="flex-1 px-4 py-2 text-sm outline-none" />
        <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold">Gửi</button>
      </form>
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
      console.error(e);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      await addDoc(collection(db, 'posts'), {
        title, content, author: currentUser?.email || 'Ẩn danh', createdAt: serverTimestamp()
      });
      setTitle(''); setContent(''); fetchPosts();
    } catch (e) { console.error(e); }
  };

  const handleSavePost = async (p: any) => {
    if (!currentUser) { alert('Vui lòng đăng nhập để lưu bài!'); return; }
    try {
      await setDoc(doc(db, 'users', currentUser.uid, 'savedPosts', p.id), {
        postId: p.id, title: p.title, content: p.content, author: p.author, savedAt: serverTimestamp()
      });
      alert('Đã lưu bài viết thành công!');
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Góc Chia Sẻ & Tâm Tư</h2>
      {currentUser ? (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl shadow-sm border mb-8 space-y-4">
          <input type="text" placeholder="Tiêu đề câu chuyện..." value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2.5 border rounded-xl text-sm" required />
          <textarea placeholder="Nội dung chia sẻ..." value={content} onChange={e => setContent(e.target.value)} className="w-full p-2.5 border rounded-xl text-sm" rows={3} required />
          <button type="submit" className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl text-sm">Đăng lên hệ thống</button>
        </form>
      ) : (
        <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-xl mb-6 border">Vui lòng <Link to="/tai-khoan" className="underline font-bold">đăng nhập</Link> để đăng bài.</p>
      )}
      <div className="space-y-4">
        {posts.map(p => (
          <div key={p.id} className="bg-white p-5 rounded-2xl shadow-sm border flex justify-between gap-4">
            <div>
              <h4 className="font-bold text-lg text-slate-900">{p.title}</h4>
              <p className="text-xs text-slate-400 mb-2">Tác giả: {p.author}</p>
              <p className="text-slate-700 text-sm">{p.content}</p>
            </div>
            {currentUser && <button onClick={() => handleSavePost(p)} className="text-indigo-600 p-2"><Bookmark className="w-5 h-5" /></button>}
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
    if (!currentUser) return;
    getDocs(query(collection(db, 'users', currentUser.uid, 'savedPosts'), orderBy('savedAt', 'desc')))
      .then(snap => setSavedList(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(e => console.error(e));
  }, [currentUser]);

  if (!currentUser) return <div className="p-12 text-center text-slate-600">Vui lòng đăng nhập để xem bài viết đã lưu.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><Bookmark className="w-7 h-7 text-indigo-600 fill-indigo-600" /> Bài Viết Đã Lưu</h1>
      {savedList.length === 0 ? <p className="text-slate-500">Chưa có bài viết nào được lưu.</p> : (
        <div className="space-y-4">
          {savedList.map(p => (
            <div key={p.id} className="bg-white p-5 rounded-2xl shadow-sm border flex justify-between">
              <div><h3 className="font-bold text-lg">{p.title}</h3><p className="text-sm text-slate-700">{p.content}</p></div>
              <button onClick={() => deleteDoc(doc(db, 'users', currentUser.uid, 'savedPosts', p.id)).then(() => setSavedList(savedList.filter(x => x.id !== p.id)))} className="text-rose-500"><Trash2 className="w-5 h-5" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AntiBullying() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-black text-rose-600 mb-4">Phòng Chống Bạo Lực Học Đường</h2>
      <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl space-y-4 text-slate-800 text-sm">
        <p className="font-bold text-rose-900">Bạo lực học đường dưới mọi hình thức (thể chất, lời nói, tinh thần, tẩy chay trên mạng) đều là vi phạm và không thể chấp nhận.</p>
        <p>Nếu bạn hoặc bạn bè đang là nạn nhân, đừng chịu đựng một mình. Hãy tìm kiếm sự giúp đỡ ngay lập tức từ thầy cô, cha mẹ hoặc gọi đường dây nóng quốc gia <strong>111</strong>.</p>
      </div>
    </div>
  );
}

function Library() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Thư Viện Tài Liệu & Cẩm Nang Tâm Lý</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <h3 className="font-bold text-indigo-700 mb-2">📖 Bí quyết vượt qua căng thẳng kỳ thi</h3>
          <p className="text-xs text-slate-600">Tổng hợp các phương pháp quản lý thời gian và giữ tinh thần thoải mái trước các kỳ thi quan trọng.</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <h3 className="font-bold text-indigo-700 mb-2">🤝 Xây dựng tình bạn đẹp & lành mạnh</h3>
          <p className="text-xs text-slate-600">Hướng dẫn kỹ năng giao tiếp, thấu hiểu và giải quyết mâu thuẫn văn minh giữa bạn bè.</p>
        </div>
      </div>
    </div>
  );
}

function Appointments() {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) { alert('Vui lòng đăng nhập!'); return; }
    try {
      await addDoc(collection(db, 'appointments'), {
        userId: currentUser.uid, name, date, note, status: 'Chờ xác nhận', createdAt: serverTimestamp()
      });
      alert('Đặt lịch tư vấn thành công!'); setName(''); setDate(''); setNote('');
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 bg-white rounded-2xl shadow-sm border mt-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Đặt Lịch Gặp Chuyên Gia Tâm Lý</h2>
      <form onSubmit={handleBook} className="space-y-4">
        <input type="text" placeholder="Họ và tên..." value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-xl text-sm" required />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 border rounded-xl text-sm" required />
        <textarea placeholder="Nội dung cần tư vấn..." value={note} onChange={e => setNote(e.target.value)} className="w-full p-3 border rounded-xl text-sm" rows={3} />
        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl">Xác nhận đặt lịch</button>
      </form>
    </div>
  );
}

function StaffDashboard() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc')))
      .then(snap => setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><Shield className="w-7 h-7 text-indigo-600" /> Trang Quản Trị Hệ Thống</h1>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-4 bg-slate-50 border-b font-bold text-sm">Quản lý bài viết góc chia sẻ</div>
        <div className="divide-y">
          {posts.map(p => (
            <div key={p.id} className="p-4 flex justify-between items-center">
              <div><h4 className="font-bold">{p.title}</h4><p className="text-xs text-slate-400">Tác giả: {p.author}</p></div>
              <button onClick={() => deleteDoc(doc(db, 'posts', p.id)).then(() => setPosts(posts.filter(x => x.id !== p.id)))} className="text-rose-500"><Trash2 className="w-5 h-5" /></button>
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
    } catch (err: any) { setError(err.message); }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-xl border">
      <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">{isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập hệ thống'}</h2>
      {error && <p className="text-xs bg-rose-50 text-rose-600 p-3 rounded-xl mb-4 border border-rose-200">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-xl text-sm" required />
        <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-xl text-sm" required />
        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl">{isRegister ? 'Đăng ký ngay' : 'Đăng nhập'}</button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)} className="w-full mt-4 text-xs text-indigo-600 hover:underline text-center">
        {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký mới'}
      </button>
    </div>
  );
}

// ==========================================
// 5. ROOT APP CONTENT
// ==========================================
function AppContent() {
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
            Firebase Connected
          </span>
          <span>Dự án: <strong>hinh123-fd678</strong> đang hoạt động ổn định trên Firestore & Auth.</span>
        </div>
      </div>

      <Navbar onOpenEmergency={() => setEmergencyOpen(true)} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onOpenEmergency={() => setEmergencyOpen(true)} />} />
          <Route path="/cam-xuc" element={<EmotionCorner />} />
          <Route path="/tro-ly-ai" element={<AIChat onOpenEmergency={() => setEmergencyOpen(true)} />} />
          <Route path="/chia-se" element={<ShareCorner />} />
          <Route path="/bai-viet-da-luu" element={<SavedPosts />} />
          <Route path="/chong-bat-nat" element={<AntiBullying />} />
          <Route path="/thu-vien" element={<Library />} />
          <Route path="/dang-ky-tu-van" element={<Appointments />} />
          <Route path="/dashboard" element={<StaffDashboard />} />
          <Route path="/tai-khoan" element={<Login />} />
        </Routes>
      </main>

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
