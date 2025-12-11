'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithEmail: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    const { data: { subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      // If user is redirected back after clicking magic link
      if (event === 'SIGNED_IN') {
        router.push('/');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router, supabase]);

  const signInWithEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      setSession(data.session);
      setUser(data.user);
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    signInWithEmail,
    signOut,
    refreshSession,
  };
      setIsLoading(true);
      // In a real app, you would call your API here
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password })
      // });
      // const data = await response.json();
      
      // Mock response
      const data = {
        user: {
          id: '1',
          name,
          email,
          avatar: `https://i.pravatar.cc/150?u=${email}`
        },
        token: 'mock-jwt-token'
      };
      
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      router.push('/');
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // In a real app, you would call your API here
      // await fetch('/api/auth/logout', {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      // });
      
      localStorage.removeItem('auth_token');
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error('Failed to logout');
    }
  };

  const loginWithGoogle = async () => {
    // In a real app, you would redirect to your backend's OAuth endpoint
    // window.location.href = '/api/auth/google';
    
    // Mock login for demo
    const mockUser = {
      id: 'google-123',
      name: 'Google User',
      email: 'google@example.com',
      avatar: 'https://i.pravatar.cc/150?u=google@example.com'
    };
    
    localStorage.setItem('auth_token', 'mock-google-token');
    setUser(mockUser);
    router.push('/');
  };

  const loginWithFacebook = async () => {
    // Similar to Google login
    const mockUser = {
      id: 'facebook-123',
      name: 'Facebook User',
      email: 'facebook@example.com',
      avatar: 'https://i.pravatar.cc/150?u=facebook@example.com'
    };
    
    localStorage.setItem('auth_token', 'mock-facebook-token');
    setUser(mockUser);
    router.push('/');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithFacebook,
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
