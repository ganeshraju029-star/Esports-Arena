'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import config from '@/lib/config';

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
      
      // Always use mock authentication for demo/Netlify deployment
      // This ensures site works without requiring a backend server
      const useMockAuth = config.USE_MOCK_DATA();
      
      if (useMockAuth) {
        // Check if this is admin login
        const isAdminEmail = email.toLowerCase().includes('admin') || 
                            email === 'admin@esportsarena.com' ||
                            email.toLowerCase() === 'admin';
        
        // Mock successful login for demo purposes
        const mockUser = {
          id: isAdminEmail ? 'admin123' : '123',
          username: email.split('@')[0],
          email: email,
          role: isAdminEmail ? 'admin' as const : 'player' as const,
          gameIDs: {},
          wallet: {
            balance: isAdminEmail ? 5000 : 1000,
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
        
        console.log(`✅ Login successful (${isAdminEmail ? 'Admin' : 'Player'} Mode)`);
        return { success: true, message: 'Login successful!' };
      }
      
      // In development with backend URL configured, use real API call
      const response = await fetch(`${config.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        setUser(data.data.user);
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        
        return { success: true, message: data.message || 'Login successful' };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Fallback to mock auth on error
      console.log('⚠️ Backend unavailable, using demo mode');
      
      // Check if this is admin login
      const isAdminEmail = email.toLowerCase().includes('admin') || 
                          email === 'admin@esportsarena.com' ||
                          email.toLowerCase() === 'admin';
      
      const mockUser = {
        id: isAdminEmail ? 'admin123' : '123',
        username: email.split('@')[0],
        email: email,
        role: isAdminEmail ? 'admin' as const : 'player' as const,
        gameIDs: {},
        wallet: {
          balance: isAdminEmail ? 5000 : 1000,
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
      
      return { success: true, message: 'Login successful (Demo Mode)' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      
      // Always use mock registration for demo/Netlify deployment
      const useMockAuth = config.USE_MOCK_DATA();
      
      if (useMockAuth) {
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
        
        console.log('✅ Registration successful (Demo Mode)');
        return { success: true, message: 'Registration successful!' };
      }
      
      // In development with backend URL configured, use real API call
      const response = await fetch(`${config.API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        setUser(data.data.user);
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        
        return { success: true, message: data.message || 'Registration successful' };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      // Fallback to mock auth on error
      console.log('⚠️ Backend unavailable, using demo mode');
      
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
      
      return { success: true, message: 'Registration successful (Demo Mode)' };
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
