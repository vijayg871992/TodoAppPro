import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Handle OAuth callback first
    handleOAuthCallback();
    
    // Check for saved token on app start
    const savedToken = localStorage.getItem('todoapppro_token');
    const savedUser = localStorage.getItem('todoapppro_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user data');
        localStorage.removeItem('todoapppro_token');
        localStorage.removeItem('todoapppro_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleOAuthCallback = () => {
    const hash = window.location.hash;
    if (hash.includes('auth/success')) {
      const urlParams = new URLSearchParams(hash.split('?')[1]);
      const token = urlParams.get('token');
      const userParam = urlParams.get('user');
      
      if (token && userParam) {
        try {
          const userData = JSON.parse(decodeURIComponent(userParam));
          login(token, userData);
          
          // Clean up URL and redirect
          window.history.replaceState({}, document.title, '/todoapppro');
        } catch (parseError) {
          console.error('Error parsing OAuth user data:', parseError);
        }
      }
    } else if (hash.includes('auth/error')) {
      const urlParams = new URLSearchParams(hash.split('?')[1]);
      const errorMessage = urlParams.get('message');
      console.error('OAuth error:', errorMessage);
      
      // Clean up URL
      window.history.replaceState({}, document.title, '/todoapppro');
    }
  };

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('todoapppro_token', newToken);
    localStorage.setItem('todoapppro_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('todoapppro_token');
    localStorage.removeItem('todoapppro_user');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};