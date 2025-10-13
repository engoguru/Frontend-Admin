import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminLogin } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await adminLogin({ email, password });
      toast.success('Login successful!');
      // In a real app, you would get a token from your backend API
      localStorage.setItem('admin-token', data.token);
      login(); // This will update the auth state
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      const errorMessage = err.message || 'Invalid credentials or server error.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            <span className="text-black">SPORT</span>
            <span className="text-red-700">EXPRESS</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">Admin Panel Login</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
