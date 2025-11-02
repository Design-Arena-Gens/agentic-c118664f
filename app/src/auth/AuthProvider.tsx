import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth, db, googleProvider } from '../firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendEmailVerification,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type UserRole = 'owner' | 'renter';

interface AuthContextValue {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db!, 'users', u.uid));
        const r = (snap.data()?.role as UserRole) || null;
        setRole(r);
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    role,
    loading,
    async login(email, password) {
      if (!auth) return;
      await signInWithEmailAndPassword(auth, email, password);
    },
    async signup(email, password, r) {
      if (!auth || !db) return;
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (cred.user && !cred.user.emailVerified) {
        await sendEmailVerification(cred.user);
      }
      await setDoc(doc(db!, 'users', cred.user.uid), { role: r, createdAt: Date.now() });
    },
    async loginWithGoogle(r) {
      if (!auth || !db) return;
      const res = await signInWithPopup(auth, googleProvider);
      const ref = doc(db!, 'users', res.user.uid);
      const existing = await getDoc(ref);
      if (!existing.exists() && r) {
        await setDoc(ref, { role: r, createdAt: Date.now() });
      }
    },
    async logout() {
      if (!auth) return;
      await signOut(auth);
    },
  }), [user, role, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
