import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">IT Documentation Portal</div>
      <div className="navbar-right">
        <span className="navbar-user">{user?.name} <span className="role-tag">{user?.role}</span></span>
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
