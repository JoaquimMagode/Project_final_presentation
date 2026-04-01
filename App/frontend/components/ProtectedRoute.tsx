import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  role: 'superadmin' | 'hospital' | 'patient';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const location = useLocation();



  return <Outlet />;
};

export default ProtectedRoute;