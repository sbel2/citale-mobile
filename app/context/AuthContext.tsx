'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/supabase/client';
import { User, Session } from '@supabase/supabase-js'; // Supabase User and Session types

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
        console.error('Failed to fetch session:', error.message);
        setUser(null);
        setSession(null);
        return;
      }

      // Set the user and session if available
      setUser(data?.session?.user || null);
      setSession(data?.session || null);
    };

    initializeAuth();

    // Subscribe to auth state changes
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session);

      switch (event) {
        case 'INITIAL_SESSION':
          console.log('Initial session:', session);
          setUser(session?.user || null);
          setSession(session || null);
          break;
        case 'SIGNED_IN':
          console.log('User signed in:', session?.user);
          setUser(session?.user || null);
          setSession(session || null);
          break;
        case 'SIGNED_OUT':
          console.log('User signed out');
          setUser(null);
          setSession(null);
          break;
        case 'PASSWORD_RECOVERY':
          console.log('Password recovery initiated');
          break;
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed:', session?.access_token);
          setSession(session || null);
          break;
        case 'USER_UPDATED':
          console.log('User updated:', session?.user);
          setUser(session?.user || null);
          break;
        default:
          console.log('Unhandled auth event:', event);
      }
    });

    // Cleanup subscription on component unmount
    return () => {
      data?.subscription?.unsubscribe(); // Correctly unsubscribe
    };
  }, [supabase]);

  // Handle logout
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
