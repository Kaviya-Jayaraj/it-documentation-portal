import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [activeTab, setActiveTab]       = useState('admin');
  const [showRegister, setShowRegister] = useState(false);
  const [form, setForm]                 = useState({ name: '', email: '', password: '' });
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [loading, setLoading]           = useState(false);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setShowRegister(false);
    setForm({ name: '', email: '', password: '' });
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Please fill in all fields.');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== activeTab) {
        setError(`Invalid credentials for ${activeTab} login.`);
        setLoading(false);
        return;
      }
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name || !form.email || !form.password) return setError('Please fill in all fields.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await api.post('/auth/register', { name: form.name, email: form.email, password: form.password });
      setSuccess('Account created! Please login.');
      setForm({ name: '', email: '', password: '' });
      setTimeout(() => setShowRegister(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>IT Documentation Portal</h2>
        <p className="subtitle">Select your role to continue</p>

        {/* 2 Tabs */}
        <div className="login-tabs">
          <button className={`tab-btn ${activeTab === 'admin' ? 'tab-active' : ''}`} onClick={() => handleTabSwitch('admin')} type="button">Admin Login</button>
          <button className={`tab-btn ${activeTab === 'user'  ? 'tab-active' : ''}`} onClick={() => handleTabSwitch('user')}  type="button">User Login</button>
        </div>

        <p className="role-label">
          {activeTab === 'admin' ? '🔐 Administrator Access' : showRegister ? '📝 Create New Account' : '👤 User Access'}
        </p>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Login Form */}
        {!showRegister && (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder={activeTab === 'admin' ? 'Enter admin email' : 'Enter your email'}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button className={`btn btn-full ${activeTab === 'admin' ? 'btn-admin' : 'btn-user'}`} disabled={loading}>
              {loading ? 'Signing in...' : `Login as ${activeTab === 'admin' ? 'Admin' : 'User'}`}
            </button>

            {/* Forgot Password link */}
            <p className="register-link">
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>

            {/* Register link only for user tab */}
            {activeTab === 'user' && (
              <p className="register-link">
                New user? <span onClick={() => { setShowRegister(true); setForm({ name: '', email: '', password: '' }); setError(''); }}>Register here</span>
              </p>
            )}
          </form>
        )}

        {/* Register Form */}
        {showRegister && activeTab === 'user' && (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Minimum 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="btn btn-full btn-register" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <p className="register-link">
              Already have an account? <span onClick={() => { setShowRegister(false); setForm({ name: '', email: '', password: '' }); setError(''); }}>Login here</span>
            </p>
          </form>
        )}

        <div className="login-hint">
          {activeTab === 'admin' && !showRegister && <p><strong>Admin:</strong> admin@example.com / admin123</p>}
          {activeTab === 'user'  && !showRegister && <p><strong>User:</strong> user@example.com / user123</p>}
        </div>
      </div>
    </div>
  );
}
