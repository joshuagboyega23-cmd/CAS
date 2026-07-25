'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.success || data.token) {
      const authToken = data.token;
      const userData = data.data?.user || data.user;

      setToken(authToken);
      setUser(userData);

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    return data;
  };

  // Register handler
  const register = async (formData) => {
    const data = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (data.success || data.token) {
      const authToken = data.token;
      const userData = data.data?.user || data.user;

      setToken(authToken);
      setUser(userData);

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    return data;
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);