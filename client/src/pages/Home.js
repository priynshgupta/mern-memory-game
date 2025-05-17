import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../assets/css/Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const rangeomColorRef = useRef(null);

  // Function to create the random colorful particle effect
  useEffect(() => {
    const colors = ['#FF6B35', '#138086', '#FFC045', '#D81159', '#3D2645'];
    const bubbleCount = 30;

    if (rangeomColorRef.current) {
      const container = rangeomColorRef.current;
      container.innerHTML = '';

      for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        const size = Math.random() * 10 + 5;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.top = `${Math.random() * 100}%`;

        bubble.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        bubble.style.animationDuration = `${Math.random() * 10 + 5}s`;
        bubble.style.animationDelay = `${Math.random() * 5}s`;

        container.appendChild(bubble);
      }
    }
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="random-color" ref={rangeomColorRef}></div>
        <h1>Memory Match</h1>
        <p className="hero-subtitle">Test your memory skills in this vibrant Indian-themed memory challenge and compete on the global leaderboard!</p>

        <div className="hero-actions">
          <Link to="/game" className="play-button">
            Play Now <span className="play-icon">▶</span>
          </Link>
          {!isAuthenticated && (
            <Link to="/register" className="register-button">
              Create Account
            </Link>
          )}
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🧠</div>
          <h3>Sharpen Your Mind</h3>
          <p>Flip and match cards to test and improve your memory skills and mental focus.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3>Compete Globally</h3>
          <p>Compare scores with players around the world and climb to the top of the leaderboard.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔥</div>
          <h3>Master the Levels</h3>
          <p>Progress through increasingly challenging levels as you elevate your memory powers.</p>
        </div>
      </div>      {isAuthenticated && user && (
        <div className="welcome-back">
          <h2>Namaste, {user.username}! 🙏</h2>
          <div className="user-stats">
            <div className="stat">
              <div className="stat-label">Current Level</div>
              <div className="stat-value">Level {user.level}</div>
              <div className="stat-icon">🔮</div>
            </div>
            <div className="stat">
              <div className="stat-label">High Score</div>
              <div className="stat-value">{user.highScore}</div>
              <div className="stat-icon">✨</div>
            </div>
          </div>
          <Link to="/game" className="continue-button">
            Continue Your Journey
          </Link>
        </div>
      )}      <div className="rules-section">
        <h2>How to Master the Game</h2>
        <ol>
          <li>Click on the mystical cards to reveal what's hidden beneath</li>
          <li>Focus your mind to find matching pairs of symbols</li>
          <li>Match all pairs to complete the level and earn enlightenment</li>
          <li>The fewer moves you make, the higher your spiritual score</li>
          <li>Advance through increasingly challenging levels to test your memory powers</li>
        </ol>

        <div className="rules-graphic">
          <div className="example-card">?</div>
          <div className="example-card flipped">🐘</div>
          <div className="example-card">?</div>
          <div className="example-card flipped">🐘</div>
        </div>
      </div>

      <div className="scroll-indicator">
        <span className="scroll-text">Scroll for a magical experience</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </div>
  );
};

export default Home;
