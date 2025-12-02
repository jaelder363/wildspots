'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, verify the session with your backend
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (token) {
          // Mock user for demo
          setUser({
            id: '1',
            name: 'Demo User',
            email: 'demo@example.com',
            avatar: 'https://i.pravatar.cc/150?u=demo@example.com'
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Mock response
      const data = {
        user: {
          id: '1',
          name: email.split('@')[0],
          email,
          avatar: `https://i.pravatar.cc/150?u=${email}`
        },
        token: 'mock-jwt-token'
      };
      
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
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
      localStorage.removeItem('auth_token');
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error('Failed to logout');
    }
  };

  const loginWithGoogle = async () => {
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
    // Mock login for demo
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        loginWithGoogle,
        loginWithFacebook,
      }}
    >
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
