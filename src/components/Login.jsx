import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { loginUser, verifyOtp, loginWithPassword } from '../services/api';

const Login = () => {
  const navigate = useNavigate();

  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'otp'
  const [step, setStep] = useState('login');  // 'login' or 'otp'
  const [formData, setFormData] = useState({
    email: '',
    whatsApp_Number: '',
    password: '',
    otp: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // UI only, no implementation yet
    if (loginMethod === 'email') {
      if (!formData.email || !formData.password) {
        alert('Please enter email and password.');
        return;
      }
      alert('UI only: Attempting to log in with password.');
      // navigate('/'); // Example navigation
    } else { // otp
      if (!formData.whatsApp_Number) {
        alert('Please enter your WhatsApp Number.');
        return;
      }
      alert('UI only: Sending OTP...');
      setStep('otp');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    // UI only, no implementation yet
    if (!formData.otp) {
      alert('Please enter the OTP.');
      return;
    }
    alert('UI only: Verifying OTP...');
    // navigate('/'); // Example navigation
  };

  const renderLoginForm = () => (
    <>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Admin Login</h1>
      <div className="flex border-b mb-4">
        <button onClick={() => setLoginMethod('email')} className={`flex-1 py-2 text-center font-semibold ${loginMethod === 'email' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
          Login Through Password
        </button>
        <button onClick={() => setLoginMethod('otp')} className={`flex-1 py-2 text-center font-semibold ${loginMethod === 'otp' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
          Login Through OTP
        </button>
      </div>

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        {loginMethod === 'email' ? (
          <>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" className="w-full px-4 py-2 border rounded-md" disabled={loading} required />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter password" className="w-full px-4 py-2 border rounded-md" disabled={loading} required />
            <button type="submit" className={`w-full py-2 rounded-md text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="text-right">
              <button type="button" className="text-sm text-blue-600 hover:underline">Forgot Password?</button>
            </div>
          </>
        ) : (
          <>
            <input type="tel" name="whatsApp_Number" value={formData.whatsApp_Number} onChange={handleChange} placeholder="Enter WhatsApp Number" className="w-full px-4 py-2 border rounded-md" disabled={loading} required />
            <button type="submit" className={`w-full py-2 rounded-md text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        )}
      </form>
    </>
  );

  const renderOtpForm = () => (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Enter OTP</h1>
      <p className="text-center text-sm text-gray-600 mb-4">An OTP has been sent to {formData.whatsApp_Number}.</p>
      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <input type="text" name="otp" value={formData.otp} onChange={handleChange} placeholder="Enter OTP" className="w-full px-4 py-2 border rounded-md" disabled={loading} required />
        <button type="submit" className={`w-full py-2 rounded-md text-white ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'}`} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        <button type="button" onClick={() => setStep('login')} className="w-full text-center text-sm text-gray-600 hover:underline mt-2" disabled={loading}>
          Back to Login
        </button>
      </form>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        {step === 'login' ? renderLoginForm() : renderOtpForm()}
      </div>
    </div>
  );
};

export default Login;
