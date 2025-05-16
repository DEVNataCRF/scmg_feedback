import React from 'react';
import { Navigate } from 'react-router-dom';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos em ms

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  const loginTime = localStorage.getItem('loginTime');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (loginTime && Date.now() - Number(loginTime) > SESSION_TIMEOUT) {
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth; 