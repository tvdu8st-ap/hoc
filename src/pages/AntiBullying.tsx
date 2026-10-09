/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, AlertTriangle, PhoneCall, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../App'; // Hoặc đường dẫn tới AuthContext của bạn
import { db } from '../App';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface AntiBullyingProps {
  onOpenEmergency: () => void;
}

export const AntiBullying: React.FC<AntiBullyingProps> = ({ onOpenEmergency }) => {
  const { currentUser } = useAuth();
  const [reportText, setReportText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'reports'), {
        content: reportText,
        author: isAnonymous ? 'Ẩn danh' : (currentUser?.email || 'Thành viên'),
        status: 'Chờ xử lý',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setReportText('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Lỗi gửi báo cáo:", error);
      alert('Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Tiêu đề trang */}
      <div className="flex items-center gap-3">
        <div className="bg-rose-100 p-3 rounded-2xl text-rose-600">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Phòng Chống Bạo Lực Học Đường</h1>
          <p className="text-xs text-slate-500">Xây dựng môi trường học tập an toàn, thân thiện và không có bạo lực</p>
        </div>
      </div>

      {/* Thông điệp cốt lõi */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-700 text-white p-6 md:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-300" /> Thông điệp quan trọng
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold">Bạo lực học đường dưới mọi hình thức đều không thể chấp nhận!</h2>
          <p className="text-rose-100 text-xs md:text-sm leading-relaxed max-w-xl">
            Dù là bạo lực thể chất, ngôn từ, tinh thần hay tẩy chay trên mạng, bạn tuyệt đối không phải chịu đựng một mình. Nhà trường luôn đứng về phía bạn.
          </p>
        </div>
        <button 
          onClick={onOpenEmergency}
          className="bg-white text-rose-700 hover:bg-rose-50 font-black px-6 py-3.5 rounded-2xl shadow-xl transition whitespace-nowrap flex items-center gap-2 shrink-0"
        >
          <PhoneCall className="w-5 h-5 animate-bounce" /> Gọi Khẩn Cấp 111
        </button>
      </div>

      {/* Nhận diện các hình thức bạo lực */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-2xl mb-3">💬</div>
          <h3 className="font-bold text-slate-900 mb-1">Bạo lực tinh thần & Lời nói</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Lăng mạ, chửi bới, chế giễu ngoại hình, đặt biệt danh ác ý hoặc đe dọa gây tổn thương tâm lý.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-2xl mb-3">🚫</div>
          <h3 className="font-bold text-slate-900 mb-1">Tẩy chay & Cô lập</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cố ý gạt bỏ một bạn học khỏi nhóm, xúi giục người khác không chơi cùng hoặc phớt lờ sự hiện diện của bạn đó.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-2xl mb-3">💻</div>
          <h3 className="font-bold text-slate-900 mb-1">Bạo lực mạng (Cyberbullying)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Nhắn tin đe dọa, tung tin đồn thất thiệt, đăng ảnh bêu xấu hoặc bình luận ác ý trên mạng xã hội.
          </p>
        </div>
      </div>

      {/* Biểu mẫu báo cáo ẩn danh / bảo mật */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-800">Kênh Gửi Báo Cáo / Tâm Thư Bảo Mật An Toàn</h2>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Nếu bạn chứng kiến hoặc là nạn nhân của bạo lực học đường, hãy điền thông tin bên dưới. Hệ thống sẽ chuyển tiếp trực tiếp đến ban tư vấn nhà trường một cách bảo mật.
        </p>

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Đã gửi báo cáo thành công! Nhà trường sẽ tiếp nhận và bảo vệ thông tin cho bạn.</span>
          </div>
        )}

        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nội dung sự việc cần báo cáo / Cần giúp đỡ</label>
            <textarea 
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              rows={4}
              placeholder="Mô tả ngắn gọn sự việc, thời gian, địa điểm hoặc tên lớp (nếu bạn biết)..."
              className="w-full p-3.5 border rounded-2xl text-sm bg-slate-50 outline-none focus:bg-white focus:border-indigo-600 transition"
              required
            />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input 
                type="checkbox" 
                checked={isAnonymous} 
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              Gửi hoàn toàn ẩn danh (Bảo mật danh tính tuyệt đối)
            </label>

            <button 
              type="submit"
              disabled={loading || !reportText.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition"
            >
              {loading ? 'Đang gửi...' : 'Gửi Báo Cáo An Toàn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
