'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ userId: number }>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  googleLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper functions for localStorage to prevent hydration errors
const getLocalStorage = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorage = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

const removeLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    loading: true,
    error: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = getLocalStorage('token');
    const refreshToken = getLocalStorage('refreshToken');
    const userStr = getLocalStorage('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setState({
          user,
          token,
          refreshToken,
          loading: false,
          error: null,
        });
      } catch (error) {
        // Handle JSON parse error
        setState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await api.login({ email, password });
      
      setLocalStorage('token', response.access_token);
      setLocalStorage('refreshToken', response.refresh_token);
      setLocalStorage('user', JSON.stringify(response.user));
      
      setState({
        user: response.user,
        token: response.access_token,
        refreshToken: response.refresh_token,
        loading: false,
        error: null,
      });

      router.push('/dashboard');
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      }));
    }
  };

  const googleLogin = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // This would be replaced with your actual Google OAuth implementation
      // For now, simulate a successful login for the UI implementation
      window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent('/dashboard')}`;
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Google login failed' 
      }));
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await api.register({ name, email, password });
      setState(prev => ({ ...prev, loading: false }));
      
      return response;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      }));
      throw error;
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await api.verifyOtp({ email, otp });
      
      // After OTP verification, redirect to login
      setState(prev => ({ ...prev, loading: false }));
      router.push('/signin');
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'OTP verification failed' 
      }));
      throw error;
    }
  };

  const logout = () => {
    removeLocalStorage('token');
    removeLocalStorage('refreshToken');
    removeLocalStorage('user');
    
    setState({
      user: null,
      token: null,
      refreshToken: null,
      loading: false,
      error: null,
    });
    
    router.push('/');
  };

  const requestPasswordReset = async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await api.requestPasswordReset(email);
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Password reset request failed' 
      }));
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await api.resetPassword({ token, newPassword });
      setState(prev => ({ ...prev, loading: false }));
      router.push('/signin');
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Password reset failed' 
      }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        verifyOtp,
        logout,
        requestPasswordReset,
        resetPassword,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 