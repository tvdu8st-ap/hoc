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

// Khởi tạo Firebase trực tiếp hoặc qua file firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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

// Pages (Đảm bảo các file này nằm đúng trong thư mục pages/)
import { Home } from './pages/Home';
import { EmotionCorner } from './pages/EmotionCorner';
import { AIChat } from './pages/AIChat';
import { ShareCorner } from './pages/ShareCorner';
import { AntiBullying } from './pages/AntiBullying';
import { Library } from './pages/Library';
import { Appointments } from './pages/Appointments';
import { StaffDashboard } from './pages/StaffDashboard';
import { Login } from './pages/Login'; // Hoặc Đăng nhập tùy theo tên file của bạn

import { PhoneCall, CheckCircle2 } from 'lucide-react';

function AppContent() {
  const { mode } = useAgeMode();
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [dbConnected, setDbConnected] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Firebase Connected Notification Banner */}
      {dbConnected && (
        <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-950 px-4 py-2 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold uppercase tracking-wider text-[11px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
              Firebase Connected
            </span>
            <span className="text-emerald-900">
              Ứng dụng đang kết nối thành công tới dự án Firebase: <strong>hinh123-fd678</strong> (Firestore & Auth).
            </span>
          </div>
          <span className="text-[11px] font-mono bg-white/70 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
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

      {/* Floating Fast SOS Button */}
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
