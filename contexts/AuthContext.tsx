'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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

  // Update localStorage whenever user data changes
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  // Initialize auth from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedRefreshToken && storedUser) {
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);
          
          // Restore user from localStorage
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (parseError) {
            console.error('Failed to parse stored user:', parseError);
            clearAuth();
            return;
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for storage events to handle multi-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' && !e.newValue) {
        // User logged out in another tab
        clearAuth();
      } else if (e.key === 'user' && e.newValue) {
        // User logged in or updated in another tab
        try {
          const parsedUser = JSON.parse(e.newValue);
          setUser(parsedUser);
        } catch (parseError) {
          console.error('Failed to parse updated user:', parseError);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const fetchUserProfile = async () => {
    try {
      // In static export, we can't fetch user profile
      // Use mock user data or return early
      if (typeof window === 'undefined') return;
      
      // For static build, skip profile fetching
      return;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      clearAuth();
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // For static build on Netlify, always use mock authentication
      // Check if we're in a browser environment
      const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
      
      if (isBrowser) {
        // Mock successful login for demo purposes
        const mockUser = {
          id: '123',
          username: email.split('@')[0],
          email: email,
          role: 'player' as const,
          gameIDs: {},
          wallet: {
            balance: 1000,
            totalEarnings: 0,
            totalSpent: 0
          },
          stats: {
            totalTournaments: 0,
            totalWins: 0,
            totalKills: 0,
            totalPoints: 0
          },
          profile: {
            displayName: email.split('@')[0],
            avatar: undefined,
            bio: undefined
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const mockToken = 'mock_jwt_token_' + Date.now();
        const mockRefreshToken = 'mock_refresh_token_' + Date.now();
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('refreshToken', mockRefreshToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setToken(mockToken);
        setRefreshToken(mockRefreshToken);
        
        return { success: true, message: 'Login successful' };
      }
      
      // This should never execute in Netlify static deployment
      console.warn('Login attempted in non-browser environment');
      return { success: false, message: 'Login not available in this environment' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      
      // For static build on Netlify, always use mock authentication
      // Check if we're in a browser environment
      const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
      
      if (isBrowser) {
        // Mock successful registration for demo purposes
        const mockUser = {
          id: '123',
          username: userData.username,
          email: userData.email,
          role: 'player' as const,
          gameIDs: userData.gameIDs || {},
          wallet: {
            balance: 1000,
            totalEarnings: 0,
            totalSpent: 0
          },
          stats: {
            totalTournaments: 0,
            totalWins: 0,
            totalKills: 0,
            totalPoints: 0
          },
          profile: {
            displayName: userData.username,
            avatar: undefined,
            bio: undefined
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const mockToken = 'mock_jwt_token_' + Date.now();
        const mockRefreshToken = 'mock_refresh_token_' + Date.now();
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('refreshToken', mockRefreshToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setToken(mockToken);
        setRefreshToken(mockRefreshToken);
        
        return { success: true, message: 'Registration successful' };
      }
      
      // This should never execute in Netlify static deployment
      console.warn('Registration attempted in non-browser environment');
      return { success: false, message: 'Registration not available in this environment' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // In static export, just clear local state
      clearAuth();
      
      // Redirect to home page after logout
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const refreshAuth = async () => {
    try {
      if (refreshToken && typeof window !== 'undefined') {
        // For static build, just generate new mock tokens
        const newToken = 'mock_jwt_token_' + Date.now();
        const newRefreshToken = 'mock_refresh_token_' + Date.now();
        
        setToken(newToken);
        setRefreshToken(newRefreshToken);
        
        localStorage.setItem('token', newToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Skip fetchUserProfile for static build
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuth();
    }
  };

  const updateProfile = async (userData: any) => {
    try {
      setIsLoading(true);
      // In static export, just update local state
      if (user) {
        setUser({ ...user, ...userData });
      }
      return { success: true, message: 'Profile updated successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Profile update failed' };
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
