import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token: newToken, refreshToken: newRefreshToken } = response.data;
          
          localStorage.setItem('token', newToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Endpoints
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => 
    api.patch(`/auth/reset-password/${token}`, { password }),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData: any) => api.patch('/users/profile', userData),
  getStats: () => api.get('/users/stats'),
  getTournaments: (status?: string) => api.get('/users/tournaments', { params: { status } }),
  getMatches: (params?: any) => api.get('/users/matches', { params }),
  getTransactions: (params?: any) => api.get('/users/transactions', { params }),
  getLeaderboard: (params?: any) => api.get('/users/leaderboard', { params }),
  searchUsers: (query: string) => api.get('/users/search', { params: { q: query } }),
  getPublicProfile: (userId: string) => api.get(`/users/${userId}`),
  reportUser: (userId: string, reason: string, description?: string) => 
    api.post(`/users/${userId}/report`, { reason, description }),
  uploadAvatar: (formData: FormData) => api.post('/users/upload-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const tournamentAPI = {
  getTournaments: (params?: any) => api.get('/tournaments', { params }),
  getFeaturedTournaments: () => api.get('/tournaments/featured'),
  getTournament: (id: string) => api.get(`/tournaments/${id}`),
  createTournament: (tournamentData: any) => api.post('/tournaments', tournamentData),
  updateTournament: (id: string, data: any) => api.patch(`/tournaments/${id}`, data),
  joinTournament: (id: string) => api.post(`/tournaments/${id}/join`),
  leaveTournament: (id: string) => api.post(`/tournaments/${id}/leave`),
  getTournamentLeaderboard: (id: string) => api.get(`/tournaments/${id}/leaderboard`),
  getTournamentStats: (id: string) => api.get(`/tournaments/${id}/stats`),
  deleteTournament: (id: string) => api.delete(`/tournaments/${id}`),
};

export const paymentAPI = {
  createOrder: (amount: number, currency?: string) => 
    api.post('/payments/create-order', { amount, currency }),
  createTournamentEntryOrder: (tournamentId: string) => 
    api.post(`/payments/tournament-entry/${tournamentId}`),
  verifyPayment: (paymentData: any) => api.post('/payments/verify', paymentData),
  getWallet: () => api.get('/payments/wallet'),
  requestWithdrawal: (withdrawalData: any) => api.post('/payments/withdraw', withdrawalData),
  getPaymentMethods: () => api.get('/payments/methods'),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  banUser: (userId: string, isBanned: boolean, banReason?: string) => 
    api.patch(`/admin/users/${userId}/ban`, { isBanned, banReason }),
  updateUserRole: (userId: string, role: string) => 
    api.patch(`/admin/users/${userId}/role`, { role }),
  getTournaments: (params?: any) => api.get('/admin/tournaments', { params }),
  addMatchResult: (tournamentId: string, resultData: any) => 
    api.post(`/admin/tournaments/${tournamentId}/results`, resultData),
  getTransactions: (params?: any) => api.get('/admin/transactions', { params }),
  processWithdrawal: (transactionId: string, status: string, reason?: string) => 
    api.patch(`/admin/withdrawal/${transactionId}`, { status, reason }),
  getAnalytics: (period?: string) => api.get('/admin/analytics', { params: { period } }),
  getSystemHealth: () => api.get('/admin/health'),
  getReports: () => api.get('/admin/reports'),
  getLogs: () => api.get('/admin/logs'),
};

export const uploadAPI = {
  uploadAvatar: (formData: FormData) => api.post('/uploads/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadMatchScreenshots: (formData: FormData) => api.post('/uploads/match-screenshot', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadTournamentThumbnail: (formData: FormData) => api.post('/uploads/tournament-thumbnail', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getFile: (filename: string) => `${API_BASE_URL}/uploads/${filename}`,
  deleteFile: (filename: string) => api.delete(`/uploads/${filename}`),
};

// Error handling utility
export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 'An error occurred';
    const errors = error.response.data?.errors || [];
    
    return {
      message,
      errors,
      status: error.response.status,
    };
  } else if (error.request) {
    // Network error
    return {
      message: 'Network error. Please check your connection.',
      errors: [],
      status: 0,
    };
  } else {
    // Other error
    return {
      message: error.message || 'An unexpected error occurred',
      errors: [],
      status: 500,
    };
  }
};

// Success response utility
export const handleApiResponse = (response: any) => {
  return {
    data: response.data.data,
    message: response.data.message,
    status: response.status,
  };
};

export default api;
