/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AgeModeProvider, useAgeMode } from './context/AgeModeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EmergencyModal } from './components/EmergencyModal';

// Khởi tạo Firebase từ file cấu hình
import { auth, db } from './firebase';

// Pages
import { Home } from './pages/Home';
import { EmotionCorner } from './pages/EmotionCorner';
import { AIChat } from './pages/AIChat';
import { ShareCorner } from './pages/ShareCorner';
import { AntiBullying } from './pages/AntiBullying';
import { Library } from './pages/Library';
import { Appointments } from './pages/Appointments';
import { StaffDashboard } from './pages/StaffDashboard';
import { Login } from './pages/Login';

import { PhoneCall, CheckCircle2, ShieldAlert } from 'lucide-react';

function AppContent() {
  const { mode } = useAgeMode();
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Kiểm tra kết nối Firebase (ví dụ kiểm tra auth hoặc kết nối Firestore cơ bản)
    try {
      if (auth && db) {
        setFirebaseConnected(true);
      } else {
        setFirebaseConnected(false);
      }
    } catch (error) {
      setFirebaseConnected(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Firebase Status Notification Banner */}
      {firebaseConnected !== null && (
        <div className={`px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-sm ${
          firebaseConnected 
            ? 'bg-emerald-50 border-b border-emerald-200 text-emerald-900' 
            : 'bg-amber-100 border-b border-amber-300 text-amber-950'
        }`}>
          <div className="flex items-center gap-2">
            {firebaseConnected ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span className={`font-bold uppercase tracking-wider text-[11px] px-2 py-0.5 rounded border ${
              firebaseConnected 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                : 'bg-amber-200 text-amber-800 border-amber-300'
            }`}>
              {firebaseConnected ? 'Đã kết nối Firebase' : 'Chưa kết nối Firebase'}
            </span>
            <span>
              {firebaseConnected 
                ? 'Ứng dụng đang kết nối thành công tới dự án Firebase: <strong>hinh123-fd678</strong>' 
                : 'Không thể khởi tạo dịch vụ Firebase. Vui lòng kiểm tra lại cấu hình.'}
            </span>
          </div>
          <span className="text-[11px] font-mono bg-white/70 px-2 py-0.5 rounded border">
            Project: hinh123-fd678
          </span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar onOpenEmergency={() => setEmergencyOpen(true)} />

      {/* Main Pages Router */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onOpenEmergency={() => setEmergencyOpen(true)} />} />
          <Route path="/cam-xuc" element={<EmotionCorner />} />
          <Route path="/tro-ly-ai" element={<AIChat onOpenEmergency={() => setEmergencyOpen(true)} />} />
          <Route path="/chia-se" element={<ShareCorner />} />
          <Route path="/chong-bat-nat" element={<AntiBullying onOpenEmergency={() => setEmergencyOpen(true)} />} />
          <Route path="/thu-vien" element={<Library />} />
          <Route path="/dang-ky-tu-van" element={<Appointments />} />
          <Route path="/dashboard" element={<StaffDashboard />} />
          <Route path="/tai-khoan" element={<Login />} />
        </Routes>
      </main>

      {/* Floating Fast SOS Button on Mobile & Desktop */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setEmergencyOpen(true)}
          className="group flex items-center gap-2 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-extrabold text-xs shadow-xl shadow-rose-300 hover:scale-105 active:scale-95 transition-all"
          title="Bấm để mở đường dây nóng 111 và phòng tư vấn"
        >
          <PhoneCall className="w-4 h-4 animate-bounce" />
          <span className="hidden sm:inline">Khẩn cấp 111</span>
        </button>
      </div>

      {/* Global Emergency Modal */}
      <EmergencyModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        ageMode={mode}
      />

      {/* Footer */}
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
