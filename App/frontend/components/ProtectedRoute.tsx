import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../App';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'PATIENT' | 'HOSPITAL';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;