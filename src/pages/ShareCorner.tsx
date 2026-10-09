/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, Bookmark, MessageSquare, Send, CheckCircle2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../App';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  setDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

export const ShareCorner = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
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
    if (!currentUser) {
      alert('Vui lòng đăng nhập để chia sẻ tâm tư lên hệ thống!');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        author: isAnonymous ? 'Ẩn danh' : (currentUser.email || 'Thành viên'),
        createdAt: serverTimestamp()
      });
      setTitle('');
      setContent('');
      setSuccessMsg('Đã đăng chia sẻ lên hệ thống thành công!');
      setTimeout(() => setSuccessMsg(''), 4000);
      fetchPosts();
    } catch (e) {
      console.error("Lỗi đăng bài:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePost = async (post: any) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để lưu bài viết vào tài khoản của bạn!');
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
      alert('Đã lưu bài viết vào danh sách "Đã lưu" của bạn!');
    } catch (e) {
      console.error("Lỗi lưu bài:", e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Tiêu đề trang */}
      <div className="flex items-center gap-3">
        <div className="bg-sky-100 p-3 rounded-2xl text-sky-600">
          <Heart className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Góc Chia Sẻ & Tâm Tư Học Đường</h1>
          <p className="text-xs text-slate-500">Nơi gửi gắm những câu chuyện đẹp, sẻ chia áp lực và lan tỏa yêu thương</p>
        </div>
      </div>

      {/* Form đăng bài */}
      {currentUser ? (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" /> Tạo chia sẻ mới
          </h2>

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tiêu đề câu chuyện</label>
              <input 
                type="text" 
                placeholder="Ví dụ: Vượt qua kỳ thi học kỳ với tâm thế thoải mái..." 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full p-3 border rounded-xl text-sm bg-slate-50 outline-none focus:bg-white focus:border-indigo-600 transition" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nội dung chia sẻ</label>
              <textarea 
                placeholder="Kể lại câu chuyện hoặc tâm sự của bạn để cùng lan tỏa năng lượng tích cực..." 
                value={content} 
                onChange={e => setContent(e.target.value)} 
                className="w-full p-3 border rounded-xl text-sm bg-slate-50 outline-none focus:bg-white focus:border-indigo-600 transition" 
                rows={4} 
                required 
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input 
                  type="checkbox" 
                  checked={isAnonymous} 
                  onChange={e => setIsAnonymous(e.target.checked)} 
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                />
                Đăng ẩn danh (Không hiển thị email cá nhân)
              </label>

              <button 
                type="submit" 
                disabled={loading || !title.trim() || !content.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> {loading ? 'Đang đăng...' : 'Đăng lên hệ thống'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-center text-sm text-amber-800">
          Vui lòng <a href="/tai-khoan" className="underline font-bold">đăng nhập</a> ở góc trên bên phải để đăng bài chia sẻ hoặc lưu bài viết.
        </div>
      )}

      {/* Danh sách bài viết */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Tâm sự từ cộng đồng học đường</h2>
        {posts.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl text-center border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm">Chưa có bài chia sẻ nào. Hãy là người đầu tiên đăng bài nhé!</p>
          </div>
        ) : (
          posts.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <User className="w-3.5 h-3.5" /> <span>Tác giả: {p.author}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900">{p.title}</h3>
                <p className="text-slate-700 text-sm leading-relaxed">{p.content}</p>
              </div>

              {currentUser && (
                <button 
                  onClick={() => handleSavePost(p)} 
                  className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition shrink-0 border border-indigo-100" 
                  title="Lưu bài viết"
                >
                  <Bookmark className="w-5 h-5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
