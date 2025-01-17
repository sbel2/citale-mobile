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
        setUser(null);
        setSession(null);
        return;
      }
      setUser(data?.session?.user || null);
      setSession(data?.session || null);
    };

    initializeAuth();

    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
      setSession(session || null);
    });

    return () => data?.subscription?.unsubscribe();
  }, [supabase]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
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
