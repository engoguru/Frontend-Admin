import { useState, useEffect } from 'react';

/**
 * A custom hook to manage admin authentication status.
 * In a real app, you would also verify the token with the backend here.
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for the token in localStorage
    const token = localStorage.getItem('admin-token');

    // For now, we'll just check if the token exists.
    // Later, you could add an API call here to validate the token.
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  return { isAuthenticated, isLoading };
};