import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RoleType } from '../types';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  switchDemoUser: (role: RoleType | 'GUEST') => Promise<void>;
  demoUsers: User[];
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [demoUsers, setDemoUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load demo users from real PostgreSQL backend
  const loadUsers = async () => {
    try {
      const res = await fetch('/api/auth/demo-users');
      const data = await res.json();
      if (data.success && data.users) {
        // Map PostgreSQL schema properties
        const mappedUsers: User[] = data.users.map((u: any) => ({
          id: String(u.id),
          username: u.uid,
          email: u.email,
          fullName: u.fullName || u.full_name,
          role: u.role,
          gradeLevel: u.gradeLevel || u.grade_level,
          phoneNumber: u.phoneNumber || u.phone_number,
        }));
        setDemoUsers(mappedUsers);

        // Set default user
        if (!user) {
          const defaultUser = mappedUsers.find((u) => u.username === 'usr-student-1') || mappedUsers[0];
          if (defaultUser) {
            setUser(defaultUser);
            setToken(defaultUser.username);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load users from PostgreSQL:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();

    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken();
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          const data = await res.json();
          if (data.success && data.user) {
            const u = data.user;
            setUser({
              id: String(u.id),
              username: u.uid,
              email: u.email,
              fullName: u.fullName || u.full_name || fbUser.displayName || 'Người dùng Google',
              role: u.role,
              gradeLevel: u.gradeLevel || u.grade_level,
            });
            setToken(idToken);
          }
        } catch (err) {
          console.error('Firebase Auth sync error:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await res.json();
      if (data.success && data.user) {
        const u = data.user;
        setUser({
          id: String(u.id),
          username: u.uid,
          email: u.email,
          fullName: u.fullName || u.full_name || result.user.displayName || 'Người dùng Google',
          role: u.role,
          gradeLevel: u.gradeLevel || u.grade_level,
        });
        setToken(idToken);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Google Sign In Error:', err);
      return false;
    }
  };

  const login = async (username: string, password: string = 'demo123'): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        const u = data.user;
        setUser({
          id: String(u.id),
          username: u.uid,
          email: u.email,
          fullName: u.fullName || u.full_name,
          role: u.role,
          gradeLevel: u.gradeLevel || u.grade_level,
        });
        setToken(data.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // Ignore
    }
    setUser(null);
    setToken(null);
  };

  const switchDemoUser = async (role: RoleType | 'GUEST') => {
    if (role === 'GUEST') {
      await logout();
      return;
    }
    const target = demoUsers.find((u) => u.role === role);
    if (target) {
      await login(target.username, 'demo123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        loginWithGoogle,
        logout,
        switchDemoUser,
        demoUsers,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
