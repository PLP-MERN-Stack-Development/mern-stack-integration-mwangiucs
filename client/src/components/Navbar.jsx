import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            MERN Blog
          </Link>
          <div className="navbar-menu">
            <Link to="/" className="navbar-link">
              Home
            </Link>
            <Link to="/posts" className="navbar-link">
              Posts
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/posts/new" className="navbar-link">
                  New Post
                </Link>
                <div className="navbar-user">
                  <span className="navbar-user-name">{user?.name}</span>
                  <button onClick={handleLogout} className="btn btn-secondary">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-link">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

