
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useStore, User } from '@/store/useStore';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const storeUser = useStore((state) => state.user);
  const loginAction = useStore((state) => state.login);
  const logoutAction = useStore((state) => state.logout);

  useEffect(() => {
    // Check if user is already logged in from store
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'user@example.com' && password === 'password') {
        const user: User = {
          id: '1',
          name: 'Demo User',
          email: 'user@example.com',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop',
          isLoggedIn: true,
        };
        
        loginAction(user);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: '1',
        name: 'Google User',
        email: 'google@example.com',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2080&auto=format&fit=crop',
        isLoggedIn: true,
      };
      
      loginAction(user);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutAction();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!storeUser,
        user: storeUser,
        login,
        loginWithGoogle,
        logout,
        loading,
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
