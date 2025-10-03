import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // While checking for authentication, show a loading indicator
  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // If authenticated, render the child routes (e.g., Dashboard).
  // Otherwise, redirect to the login page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;