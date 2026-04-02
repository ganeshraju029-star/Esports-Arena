// Environment configuration for Netlify deployment
// This bypasses need for .env files in production

const config = {
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-url.com/api',
  
  // Application Settings
  APP_NAME: 'Esports Arena',
  APP_VERSION: '1.0.0',
  
  // Admin Configuration
  ADMIN_EMAIL: 'admin@esportsarena.com',
  
  // Development Detection
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_BROWSER: typeof window !== 'undefined',
  
  // Mock Mode Detection - Override for production with API
  USE_MOCK_DATA: () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const forceMock = process.env.FORCE_MOCK_DATA === 'true';
    
    // Only use mock if explicitly forced OR no API URL AND production
    return forceMock || 
           (!apiBaseUrl && process.env.NODE_ENV === 'production');
  }
};

export default config;
