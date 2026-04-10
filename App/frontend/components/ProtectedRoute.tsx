import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  role: 'superadmin' | 'hospital' | 'patient';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role }) => {
  // === ORIGINAL AUTH LOGIC (commented out for dev access) ===
  // const token = localStorage.getItem('token');
  // const user = JSON.parse(localStorage.getItem('user') || 'null');
  // const location = useLocation();

  // // Not logged in → redirect to login, preserve intended destination
  // if (!token || !user) {
  //   return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  // }

  // // Wrong role → redirect to their correct dashboard
  // if (user.role !== role) {
  //   const dashMap: Record<string, string> = {
  //     superadmin: '/superadmin',
  //     hospital: '/hospital',
  //     patient: '/patient',
  //   };
  //   return <Navigate to={dashMap[user.role] ?? '/'} replace />;
  // }
  // === END ORIGINAL AUTH LOGIC ===

  // DEV BYPASS: allow access to all dashboards without login
  return <Outlet />;
};

export default ProtectedRoute;
