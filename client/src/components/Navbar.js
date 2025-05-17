import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../assets/css/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" className="nav-logo">Memory Match</NavLink>
      </div>      <div className="navbar-menu">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          Home
        </NavLink>
        <NavLink to="/game" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          Play Game
        </NavLink>
        <NavLink to="/leaderboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          Leaderboard
        </NavLink>
      </div>
      <div className="navbar-end">
        {isAuthenticated ? (
          <>
            <span className="user-info">
              <i className="fas fa-user"></i> {user?.username || 'User'}
              {user?.level > 1 && (
                <span className="user-level">Lvl {user.level}</span>
              )}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({isActive}) => isActive ? "auth-btn login-btn active" : "auth-btn login-btn"}>
              Login
            </NavLink>
            <NavLink to="/register" className={({isActive}) => isActive ? "auth-btn register-btn active" : "auth-btn register-btn"}>
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
