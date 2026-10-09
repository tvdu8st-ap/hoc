/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Search, Download, Bookmark, FileText, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../App';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { currentUser } = useAuth();

  const documents = [
    {
      id: 'doc-1',
      title: 'Bí quyết vượt qua căng thẳng và áp lực thi cử',
      category: 'KyNang',
      author: 'Phòng Tư Vấn Tâm Lý Học Đường',
      description: 'Tổng hợp các phương pháp quản lý thời gian, kỹ thuật hít thở thư giãn và giữ tinh thần minh mẫn trước các kỳ thi quan trọng.',
      readTime: '5 phút đọc'
    },
    {
      id: 'doc-2',
      title: 'Xây dựng tình bạn đẹp & ứng xử văn minh học đường',
      category: 'GiaoTiep',
      author: 'Chuyên gia Nguyễn Thị Hoa',
      description: 'Hướng dẫn kỹ năng giao tiếp, thấu hiểu sự khác biệt, đồng cảm và cách giải quyết mâu thuẫn lành mạnh giữa bạn bè.',
      readTime: '7 phút đọc'
    },
    {
      id: 'doc-3',
      title: 'Cẩm nang nhận diện và phòng chống bắt nạt mạng (Cyberbullying)',
      category: 'BaoLuc',
      author: 'Ban Biên Tập Sức Khỏe Tinh Thần',
      description: 'Nhận diện các hình thức bắt nạt trên không gian mạng và các bước bảo vệ bản thân, báo cáo vi phạm an toàn.',
      readTime: '6 phút đọc'
    },
    {
      id: 'doc-4',
      title: 'Lắng nghe cơ thể: Tầm quan trọng của giấc ngủ đối với lứa tuổi học trò',
      category: 'SucKhoe',
      author: 'Y Tế Học Đường',
      description: 'Giải thích khoa học về chu kỳ giấc ngủ và lý do vì sao học sinh cần ngủ đủ 8 tiếng mỗi ngày để phát triển tối ưu.',
      readTime: '4 phút đọc'
    }
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveToAccount = async (docItem: any) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để lưu tài liệu vào tài khoản của bạn!');
      return;
    }
    try {
      const savedRef = doc(db, 'users', currentUser.uid, 'savedPosts', docItem.id);
      await setDoc(savedRef, {
        postId: docItem.id,
        title: docItem.title,
        content: docItem.description,
        author: docItem.author,
        savedAt: serverTimestamp()
      });
      alert('Đã lưu tài liệu vào danh sách bài viết/tài liệu đã lưu của bạn!');
    } catch (error) {
      console.error("Lỗi khi lưu tài liệu:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Tiêu đề trang */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
          <BookOpen className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Thư Viện Cẩm Nang & Tài Liệu Tâm Lý</h1>
          <p className="text-xs text-slate-500">Kho tài liệu kỹ năng sống, cẩm nang chăm sóc sức khỏe tinh thần cho học sinh</p>
        </div>
      </div>

      {/* Thanh tìm kiếm & Lọc danh mục */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm cẩm nang, tài liệu..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-600 transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả
          </button>
          <button 
            onClick={() => setSelectedCategory('KyNang')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'KyNang' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Kỹ năng học tập
          </button>
          <button 
            onClick={() => setSelectedCategory('GiaoTiep')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'GiaoTiep' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Giao tiếp & Bạn bè
          </button>
          <button 
            onClick={() => setSelectedCategory('BaoLuc')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'BaoLuc' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Phòng chống bạo lực
          </button>
        </div>
      </div>

      {/* Danh sách tài liệu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocs.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-100">
                  {item.readTime}
                </span>
                <span className="text-xs text-slate-400">{item.author}</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{item.description}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button 
                onClick={() => alert(`Đang mở tài liệu: ${item.title}`)}
                className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-bold text-xs"
              >
                <FileText className="w-4 h-4" /> Đọc trực tuyến <ExternalLink className="w-3 h-3" />
              </button>

              <button 
                onClick={() => handleSaveToAccount(item)}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-xl text-xs font-semibold transition"
                title="Lưu vào tài khoản"
              >
                <Bookmark className="w-4 h-4" /> Lưu tài liệu
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
