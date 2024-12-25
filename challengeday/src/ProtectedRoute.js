// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, isAuth, ...rest }) => {
  return isAuth ? element : <Navigate to="/login" {...rest} />;
};
const ProtectedRoute1 = ({ element, isAuth, ...rest }) => {
    return isAuth ? element : <Navigate to="/" {...rest} />;
  };

export  { ProtectedRoute, ProtectedRoute1};
