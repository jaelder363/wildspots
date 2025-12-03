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
  isAuthenticated: boolean;
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
        // In a real app, you would verify the session with your backend
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Verify token with your backend
          // const response = await fetch('/api/auth/me', {
          //   headers: { 'Authorization': `Bearer ${token}` }
          // });
          // const userData = await response.json();
          // setUser(userData);
          
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
      // In a real app, you would call your API here
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      
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
