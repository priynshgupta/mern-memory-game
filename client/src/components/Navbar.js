import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import '../assets/css/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isMuted, toggleMute, playMusic, volume, setAudioVolume } = useAudio();
  const navigate = useNavigate();
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePlayGame = () => {
    // Start music when Play Game is clicked
    playMusic();
    navigate('/game');
  };

  const handleVolumeChange = (e) => {
    setAudioVolume(parseFloat(e.target.value));
  };

  return (
    <nav className="navbar">      <div className="navbar-brand">
        <NavLink to="/" className="nav-logo">Dhyaan Chakra</NavLink>
      </div>      <div className="navbar-menu">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          Home
        </NavLink>        <button onClick={handlePlayGame} className="nav-item">
          Play Game
        </button>
        <NavLink to="/leaderboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          Leaderboard
        </NavLink>
        <div
          className="sound-control"
          onMouseEnter={() => setShowVolumeControl(true)}
          onMouseLeave={() => setShowVolumeControl(false)}
        >
          <button
            className="sound-toggle-btn"
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {showVolumeControl && (
            <div className="volume-slider-container">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
          )}
        </div>
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
