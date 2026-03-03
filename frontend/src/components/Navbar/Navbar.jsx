import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './_navbar.scss';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">⬡</span>
          <span className="navbar__logo-text">
            Cipher<span className="navbar__logo-accent">SQL</span> Studio
          </span>
        </Link>

        <div className="navbar__center">
          <span className="navbar__tagline">Interactive SQL Learning Platform</span>
        </div>

        <div className="navbar__links">
          {isAuthenticated ? (
            <>
              <Link to="/" className="navbar__link">Practice</Link>
              <Link to="/dashboard" className="navbar__link">Dashboard</Link>
              {isAdmin && (
                <Link to="/admin" className="navbar__link navbar__link--admin">
                  ⚙ Admin
                </Link>
              )}
              <div className="navbar__user">
                <span className="navbar__username">@{user?.username}</span>
                <button id="navbar-logout" className="navbar__logout" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__link">Sign In</Link>
              <Link to="/register" className="navbar__btn">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

