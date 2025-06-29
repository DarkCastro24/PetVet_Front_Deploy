import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function RouteProtectedUser({ allowedRoles = [], children }) {
  const token  = localStorage.getItem('token');
  const roleId = parseInt(localStorage.getItem('role_id'), 10);
  const loc    = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  if (!allowedRoles.includes(roleId)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
