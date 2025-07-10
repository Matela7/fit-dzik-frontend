// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sprawdź czy użytkownik jest zalogowany przy ładowaniu aplikacji
  useEffect(() => {
    const savedUser = localStorage.getItem('fitdzik_user');
    const savedToken = localStorage.getItem('fitdzik_token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('fitdzik_user', JSON.stringify(userData));
    localStorage.setItem('fitdzik_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fitdzik_user');
    localStorage.removeItem('fitdzik_token');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
