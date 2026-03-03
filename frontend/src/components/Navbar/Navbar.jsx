import React from 'react';
import { Link } from 'react-router-dom';
import './_navbar.scss';

const Navbar = () => {
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
          <Link to="/" className="navbar__link">Assignments</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
