import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Thay thế các thông tin dưới đây bằng cấu hình thực tế từ Firebase Console của bạn
const firebaseConfig = {
  apiKey: "AIzaSyDoJVOu_L_J61MK3RWgB2C0xbP7F19mw3A",
  authDomain: "hinh123-fd678.firebaseapp.com",
  databaseURL: "https://hinh123-fd678-default-rtdb.firebaseio.com",
  projectId: "hinh123-fd678",
  storageBucket: "hinh123-fd678.firebasestorage.app",
  messagingSenderId: "185063045840",
  appId: "1:185063045840:web:49aed5e7258cae072a7cd5"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất các dịch vụ bạn muốn sử dụng (Authentication, Firestore Database,...)
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
