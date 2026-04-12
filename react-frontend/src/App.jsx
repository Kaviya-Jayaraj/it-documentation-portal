import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DocProvider } from './context/DocContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ForgotPassword from './pages/ForgotPassword';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DocProvider>
          <Routes>
            <Route path="/"       element={<Navigate to="/login" replace />} />
            <Route path="/login"  element={<Login />} />
            <Route path="/admin"  element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/dashboard"       element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </DocProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
