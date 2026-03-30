import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  role: 'superadmin' | 'hospital' | 'patient';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default ProtectedRoute;