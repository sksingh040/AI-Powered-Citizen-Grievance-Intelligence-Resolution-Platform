import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMeApi, loginApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('civic_auth_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await getMeApi();
          if (res.data.success) {
            setUser(res.data.data.user);
          }
        } catch (err) {
          console.warn('Session expired or invalid token');
          logout();
        }
      }
      setLoading(false);
    };
    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    if (res.data.success) {
      const { user: loggedInUser, token: authToken } = res.data.data;
      setUser(loggedInUser);
      setToken(authToken);
      localStorage.setItem('civic_auth_token', authToken);
      return loggedInUser;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('civic_auth_token');
  };

  const isStaff = user && ['field_officer', 'supervisor', 'admin', 'auditor'].includes(user.role);
  const isAdmin = user && user.role === 'admin';
  const isSupervisor = user && (user.role === 'supervisor' || user.role === 'admin');
  const isAuditor = user && (user.role === 'auditor' || user.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isStaff,
        isAdmin,
        isSupervisor,
        isAuditor
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
