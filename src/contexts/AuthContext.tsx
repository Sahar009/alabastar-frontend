"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { auth, signInWithGoogle, logout as firebaseLogout, onAuthStateChange } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  provider: string;
}

interface Customer {
  id: string;
  preferences: Record<string, unknown>;
  notificationSettings: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  customer: Customer | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (userData: { fullName: string; email: string; phone?: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: { fullName?: string; phone?: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing backend authentication first
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const customerData = localStorage.getItem('customer');

    if (token && userData) {
      setUser(JSON.parse(userData));
      if (customerData) {
        setCustomer(JSON.parse(customerData));
      }
      setLoading(false);
      return;
    }

    // If no backend auth, check Firebase (only if configured)
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // User is signed in via Firebase, get or create user in our backend
        await handleFirebaseAuth(firebaseUser);
      } else {
        // User is signed out from Firebase
        setUser(null);
        setCustomer(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('customer');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFirebaseAuth = async (firebaseUser: FirebaseUser) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();
      
      // Send to backend for verification/creation
      const response = await fetch(`${base}/api/auth/firebase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          uid: firebaseUser.uid
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
        setCustomer(data.data.customer);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        if (data.data.customer) {
          localStorage.setItem('customer', JSON.stringify(data.data.customer));
        }
      } else {
        console.error('Backend auth failed:', await response.text());
        // Sign out from Firebase if backend auth fails
        await firebaseLogout();
      }
    } catch (error) {
      console.error('Firebase auth handler error:', error);
      await firebaseLogout();
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Use backend authentication for email/password
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        if (data.data.customer) {
          localStorage.setItem('customer', JSON.stringify(data.data.customer));
        }
        setUser(data.data.user);
        setCustomer(data.data.customer);
        toast.success('Login successful!');
        return true;
      } else {
        toast.error(data.message || 'Login failed');
        return false;
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      toast.error('Network error. Please try again.');
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        toast.error('Firebase is not configured. Please contact support.');
        return false;
      }
      await signInWithGoogle();
      // Firebase auth state change will handle the rest
      return true;
    } catch (error: unknown) {
      console.error('Google login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Google login failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (userData: { fullName: string; email: string; phone?: string; password: string }): Promise<boolean> => {
    try {
      // Use backend authentication for email/password registration
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account created successfully! Please sign in.');
        return true;
      } else {
        toast.error(data.message || 'Registration failed');
        return false;
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
      toast.error('Network error. Please try again.');
      return false;
    }
  };

  const logout = async () => {
    try {
      // If user is logged in via Firebase, sign out from Firebase
      if (firebaseUser) {
        await firebaseLogout();
      }
      
      // Clear local state regardless of auth method
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('customer');
      setUser(null);
      setCustomer(null);
      setFirebaseUser(null);
      
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if Firebase fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('customer');
      setUser(null);
      setCustomer(null);
      setFirebaseUser(null);
      toast.success('Logged out successfully');
      router.push('/');
    }
  };

  const updateProfile = async (data: { fullName?: string; phone?: string }): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (response.ok) {
        setUser(responseData.data.user);
        setCustomer(responseData.data.customer);
        localStorage.setItem('user', JSON.stringify(responseData.data.user));
        if (responseData.data.customer) {
          localStorage.setItem('customer', JSON.stringify(responseData.data.customer));
        }
        toast.success('Profile updated successfully');
        return true;
      } else {
        toast.error(responseData.message || 'Update failed');
        return false;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Network error. Please try again.');
      return false;
    }
  };

  const value = {
    user,
    customer,
    firebaseUser,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
