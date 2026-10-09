/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../App';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export const Appointments = () => {
  const { currentUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [counselor, setCounselor] = useState('Cô Nguyễn Thị Hoa (Chuyên gia tâm lý học đường)');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('08:00 - 09:00');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [myAppointments, setMyAppointments] = useState<any[]>([]);

  // Tải danh sách lịch hẹn của user hiện tại từ Firestore
  const fetchAppointments = async () => {
    if (!currentUser) return;
    try {
      const q = query(
        collection(db, 'appointments'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      setMyAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Lỗi tải lịch hẹn:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Vui lòng đăng nhập trước khi đặt lịch tư vấn!');
      return;
    }
    if (!fullName.trim() || !phone.trim() || !date) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    setLoading(true);
    setSuccessMsg('');

    try {
      await addDoc(collection(db, 'appointments'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        fullName,
        phone,
        counselor,
        date,
        timeSlot,
        note,
        status: 'Chờ xác nhận',
        createdAt: serverTimestamp()
      });

      setSuccessMsg('Đặt lịch tư vấn thành công! Nhà trường sẽ liên hệ và xác nhận với bạn sớm nhất.');
      setFullName('');
      setPhone('');
      setNote('');
      fetchAppointments();
    } catch (error: any) {
      console.error("Lỗi đặt lịch:", error);
      alert('Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
          <CalendarIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Đặt Lịch Tư Vấn Tâm Lý Học Đường</h1>
          <p className="text-xs text-slate-500">Bảo mật tuyệt đối, đồng hành cùng sự phát triển tâm lý học sinh</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Đặt Lịch */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Phiếu đăng ký gặp chuyên gia</h2>
          
          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {!currentUser && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Vui lòng đăng nhập ở góc trên bên phải để tiến hành đặt lịch tư vấn.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Họ và tên học sinh / Phụ huynh</label>
              <div className="flex items-center border rounded-xl px-3 bg-slate-50 focus-within:bg-white focus-within:border-indigo-600">
                <User className="w-4 h-4 text-slate-400 mr-2" />
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Nhập họ và tên..."
                  className="w-full py-2.5 text-sm outline-none bg-transparent"
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Số điện thoại liên hệ</label>
                <div className="flex items-center border rounded-xl px-3 bg-slate-50 focus-within:bg-white focus-within:border-indigo-600">
                  <Phone className="w-4 h-4 text-slate-400 mr-2" />
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Số điện thoại..."
                    className="w-full py-2.5 text-sm outline-none bg-transparent"
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Chọn chuyên gia / Cố vấn</label>
                <select 
                  value={counselor} 
                  onChange={e => setCounselor(e.target.value)}
                  className="w-full py-2.5 px-3 border rounded-xl text-sm bg-slate-50 outline-none focus:bg-white focus:border-indigo-600"
                >
                  <option value="Cô Nguyễn Thị Hoa (Chuyên gia tâm lý học đường)">Cô Nguyễn Thị Hoa (Tâm lý học đường)</option>
                  <option value="Thầy Trần Minh Quân (Cố vấn hướng nghiệp & học tập)">Thầy Trần Minh Quân (Hướng nghiệp)</option>
                  <option value="Phòng tư vấn chung (Sẽ phân công chuyên gia)">Phòng tư vấn chung (Ngẫu nhiên)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Ngày hẹn</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)}
                  className="w-full py-2.5 px-3 border rounded-xl text-sm bg-slate-50 outline-none focus:bg-white focus:border-indigo-600"
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Khung giờ</label>
                <select 
                  value={timeSlot} 
                  onChange={e => setTimeSlot(e.target.value)}
                  className="w-full py-2.5 px-3 border rounded-xl text-sm bg-slate-50 outline-none focus:bg-white focus:border-indigo-600"
                >
                  <option value="08:00 - 09:00">08:00 - 09:00 (Buổi sáng)</option>
                  <option value="09:30 - 10:30">09:30 - 10:30 (Buổi sáng)</option>
                  <option value="14:00 - 15:00">14:00 - 15:00 (Buổi chiều)</option>
                  <option value="15:30 - 16:30">15:30 - 16:30 (Buổi chiều)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nội dung cần tư vấn / Tâm sự thêm</label>
              <textarea 
                value={note} 
                onChange={e => setNote(e.target.value)}
                rows={3} 
                placeholder="Chia sẻ ngắn gọn vấn đề bạn đang gặp phải để chuyên gia chuẩn bị hỗ trợ tốt hơn..."
                className="w-full p-3 border rounded-xl text-sm bg-slate-50 outline-none focus:bg-white focus:border-indigo-600"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !currentUser}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition shadow-md"
            >
              {loading ? 'Đang gửi lịch hẹn...' : 'Xác nhận đặt lịch tư vấn'}
            </button>
          </form>
        </div>

        {/* Lịch hẹn đã đặt của tôi */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 text-base mb-4">Lịch hẹn của bạn</h3>
          {!currentUser ? (
            <p className="text-xs text-slate-500">Đăng nhập để xem lịch hẹn đã đặt.</p>
          ) : myAppointments.length === 0 ? (
            <p className="text-xs text-slate-400">Bạn chưa có lịch hẹn tư vấn nào trên hệ thống.</p>
          ) : (
            <div className="space-y-3">
              {myAppointments.map(item => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-indigo-700">{item.counselor}</div>
                  <div className="text-slate-600 flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.
