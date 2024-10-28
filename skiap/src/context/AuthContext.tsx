import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, verifyToken, getUserById } from '../lib/db';

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  token: string | null;
  setAuth: (user: Omit<User, 'password'>, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  setAuth: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const { userId } = verifyToken(storedToken);
        getUserById(userId).then(user => {
          if (user) {
            setUser(user);
            setToken(storedToken);
          }
        });
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const setAuth = (user: Omit<User, 'password'>, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}