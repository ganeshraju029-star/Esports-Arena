'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI, handleApiError } from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'player' | 'admin';
  gameIDs: {
    freeFire?: string;
    pubg?: string;
    freeFireLevel?: number;
    pubgLevel?: number;
  };
  wallet: {
    balance: number;
    totalEarnings: number;
    totalSpent: number;
  };
  stats: {
    totalTournaments: number;
    totalWins: number;
    totalKills: number;
    totalPoints: number;
    globalRank?: number;
  };
  profile: {
    avatar?: string;
    displayName?: string;
    bio?: string;
  };
  isBanned?: boolean;
  banReason?: string;
  emailVerified?: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: any) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateProfile: (userData: any) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';

  // Initialize auth from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedRefreshToken = localStorage.getItem('refreshToken');

        if (storedToken && storedRefreshToken) {
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);
          
          // Verify token by fetching user profile
          await fetchUserProfile();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      clearAuth();
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { user: userData, token: newToken, refreshToken: newRefreshToken } = data.data;
      
      setToken(newToken);
      setRefreshToken(newRefreshToken);
      setUser(userData);
      
      // Store in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      return { success: true, message: 'Login successful' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      
      // Create FormData for register API
      const formData = new FormData();
      formData.append('username', userData.username);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('confirmPassword', userData.confirmPassword);
      formData.append('role', userData.role || 'player');
      
      if (userData.gameIDs.freeFire) {
        formData.append('freeFire', userData.gameIDs.freeFire);
      }
      if (userData.gameIDs.pubg) {
        formData.append('pubg', userData.gameIDs.pubg);
      }
      if (userData.gameIDs.freeFireLevel) {
        formData.append('freeFireLevel', userData.gameIDs.freeFireLevel.toString());
      }
      if (userData.gameIDs.pubgLevel) {
        formData.append('pubgLevel', userData.gameIDs.pubgLevel.toString());
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const { user: newUser, token: newToken, refreshToken: newRefreshToken } = data.data;
      
      setToken(newToken);
      setRefreshToken(newRefreshToken);
      setUser(newUser);
      
      // Store in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      return { success: true, message: 'Registration successful' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  const refreshAuth = async () => {
    try {
      if (refreshToken) {
        const response = await authAPI.refresh(refreshToken);
        const { token: newToken, refreshToken: newRefreshToken } = response.data;
        
        setToken(newToken);
        setRefreshToken(newRefreshToken);
        
        localStorage.setItem('token', newToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        await fetchUserProfile();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuth();
    }
  };

  const updateProfile = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await authAPI.updateProfile(userData);
      setUser(response.data.data.user);
      return { success: true, message: 'Profile updated successfully' };
    } catch (error: any) {
      const errorInfo = handleApiError(error);
      return { success: false, message: errorInfo.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    refreshToken,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    refreshAuth,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
