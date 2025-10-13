import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const verifyAuth = useCallback(() => {
    const token = localStorage.getItem('admin-token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    verifyAuth();
    // Listen for storage changes to sync tabs
    window.addEventListener('storage', verifyAuth);
    return () => {
      window.removeEventListener('storage', verifyAuth);
    };
  }, [verifyAuth]);

  const logout = () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin'); // Also remove admin details if stored
    setIsAuthenticated(false);
    toast.success('Logged out successfully!');
    // Delay navigation to allow the toast to be seen
    // The navigate call is wrapped in a timeout
    setTimeout(() => navigate('/login'), 500);
  };

  const value = { isAuthenticated, isLoading, logout, login: verifyAuth };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);