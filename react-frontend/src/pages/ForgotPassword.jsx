import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep]       = useState(1); // 1=email, 2=otp, 3=newpassword
  const [email, setEmail]     = useState('');
  const [otp, setOtp]         = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setSuccess(data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally { setLoading(false); }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      setSuccess(data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP.');
    } finally { setLoading(false); }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirm) return setError('Passwords do not match.');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', { email, otp, newPassword });
      setSuccess(data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Forgot Password</h2>
        <p className="subtitle">
          {step === 1 && 'Enter your email to receive OTP'}
          {step === 2 && 'Enter the OTP from server console'}
          {step === 3 && 'Set your new password'}
        </p>

        {/* Step indicators */}
        <div className="step-indicator">
          <span className={`step ${step >= 1 ? 'step-active' : ''}`}>1</span>
          <span className="step-line" />
          <span className={`step ${step >= 2 ? 'step-active' : ''}`}>2</span>
          <span className="step-line" />
          <span className={`step ${step >= 3 ? 'step-active' : ''}`}>3</span>
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Step 1 */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label>Enter OTP</label>
              <input type="text" placeholder="6-digit OTP from console" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
              <small style={{ color: '#666', fontSize: '12px' }}>Check backend terminal for OTP</small>
            </div>
            <button className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button className="btn btn-secondary btn-full" style={{ marginTop: '8px' }} type="button" onClick={() => { setStep(1); setError(''); setSuccess(''); }}>Back</button>
          </form>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="Minimum 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Re-enter new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
            <button className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="register-link" style={{ marginTop: '16px' }}>
          <span onClick={() => navigate('/login')}>Back to Login</span>
        </p>
      </div>
    </div>
  );
}
