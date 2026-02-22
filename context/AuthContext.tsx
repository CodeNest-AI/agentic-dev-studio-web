import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, tokenStorage, User, AuthResponse } from '@/constants/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  setAuth: (res: AuthResponse) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session on mount
    const token = tokenStorage.get('accessToken');
    if (token) {
      api.auth.me()
        .then(setUser)
        .catch(() => {
          tokenStorage.remove('accessToken');
          tokenStorage.remove('refreshToken');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const setAuth = (res: AuthResponse) => {
    tokenStorage.set('accessToken', res.accessToken);
    tokenStorage.set('refreshToken', res.refreshToken);
    setUser(res.user);
  };

  const login = async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    setAuth(res);
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const res = await api.auth.register(email, password, firstName, lastName);
    setAuth(res);
  };

  const logout = () => {
    tokenStorage.remove('accessToken');
    tokenStorage.remove('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, isLoading,
      isAuthenticated: !!user,
      login, register, logout, setAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
