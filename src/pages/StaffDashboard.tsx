/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, Trash2, Calendar, MessageSquare, CheckCircle2 } from 'lucide-react';
import { db } from '../App';
import { collection, getDocs, deletedoc, doc, query, orderBy } from 'firebase/firestore';

export const StaffDashboard = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'appointments'>('posts');

  const fetchData = async () => {
    try {
      // Tải danh sách bài viết góc chia sẻ
      const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const postsSnapshot = await getDocs(postsQuery);
      setPosts(postsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

      // Tải danh sách lịch hẹn tư vấn
      const apptQuery = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
      const apptSnapshot = await getDocs(apptQuery);
      setAppointments(apptSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Lỗi tải dữ liệu quản trị:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeletePost = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này khỏi hệ thống?")) {
      try {
        await deletedoc(doc(db, 'posts', id));
        setPosts(posts.filter(p => p.id !== id));
      } catch (e) {
        console.error("Lỗi xóa bài viết:", e);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Tiêu đề trang quản trị */}
      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Trang Quản Trị Hệ Thống (Staff Dashboard)</h1>
          <p className="text-xs text-slate-500">Dành cho cán bộ tâm lý, giáo viên và quản trị viên nhà trường</p>
        </div>
      </div>

      {/* Tabs chuyển đổi */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'posts' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Quản lý bài viết góc chia sẻ ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'appointments' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" /> Lịch hẹn tư vấn ({appointments.length})
        </button>
      </div>

      {/* Nội dung tab Bài viết */}
      {activeTab === 'posts' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-sm">
            Danh sách tất cả bài viết tâm tư của học sinh
          </div>
          {posts.length === 0 ? (
            <p className="p-8 text-center text-xs text-slate-400">Chưa có bài viết nào trên hệ thống.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {posts.map(p => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{p.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Tác giả: {p.author}</p>
                    <p className="text-slate-600 text-xs mt-1 line-clamp-1">{p.content}</p>
                  </div>
                  <button 
                    onClick={() => handleDeletePost(p.id)} 
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition shrink-0"
                    title="Xóa bài viết"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Nội dung tab Lịch hẹn */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-sm">
            Danh sách lịch hẹn tư vấn tâm lý từ học sinh / phụ huynh
          </div>
          {appointments.length === 0 ? (
            <p className="p-8 text-center text-xs text-slate-400">Chưa có lịch hẹn tư vấn nào được đặt.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {appointments.map(item => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-sm">{item.fullName || item.name} ({item.userEmail})</div>
                    <div className="text-xs text-indigo-600 font-medium">Chuyên gia: {item.counselor || 'Phòng tư vấn chung'}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Ngày: {item.date} {item.timeSlot && `(${item.timeSlot})`}
                    </div>
                    {item.note && <p className="text-xs text-slate-600 bg-slate-100 p-2 rounded-lg mt-1">Nội dung: {item.note}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                      {item.status || 'Chờ xác nhận'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
