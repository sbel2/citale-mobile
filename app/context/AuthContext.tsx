'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/supabase/client';
import { User, Session } from '@supabase/supabase-js';

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  session: Session | null;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const initializeAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        setUser(null);
        setSession(null);
        return;
      }
      setUser(data?.session?.user || null);
      setSession(data?.session || null);
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      setUser(session?.user || null);
      setSession(session || null);
    });

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);

      // Clear tokens and session data
      localStorage.clear();
      sessionStorage.clear();
      document.cookie = `sb-access-token=; path=/; Max-Age=0`;
      document.cookie = `sb-refresh-token=; path=/; Max-Age=0`;

      // Recheck session to confirm logout
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Session after logout:', sessionData);

      if (!sessionData.session) {
        console.log('Session cleared successfully.');
      } else {
        console.warn('Session still active:', sessionData);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
