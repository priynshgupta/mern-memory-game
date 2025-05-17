import React from 'react';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import '../assets/css/GameStats.css';

const GameStats = () => {
  const { moves, score, currentLevel, gameOver, startTime, endTime } = useGame();
  const { isAuthenticated, user } = useAuth();

  // Calculate time played in seconds
  const calculateTime = () => {
    if (!startTime) return 0;
    const end = endTime || Date.now();
    return Math.floor((end - startTime) / 1000);
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <div className="game-stats">
      <div className="stat-box">
        <div className="stat-label"><span className="stat-icon">🔥</span> Level</div>
        <div className="stat-value">{currentLevel}</div>
      </div>
      <div className="stat-box">
        <div className="stat-label"><span className="stat-icon">👐</span> Moves</div>
        <div className="stat-value">{moves}</div>
      </div>
      <div className="stat-box">
        <div className="stat-label"><span className="stat-icon">✨</span> Score</div>
        <div className="stat-value">{score}</div>
      </div>
      <div className="stat-box">
        <div className="stat-label"><span className="stat-icon">⏱️</span> Time</div>
        <div className="stat-value">{formatTime(calculateTime())}</div>
      </div>
      {isAuthenticated && user && (
        <div className="stat-box high-score">
          <div className="stat-label"><span className="stat-icon">🏆</span> High Score</div>
          <div className="stat-value">{user.highScore || 0}</div>
        </div>
      )}
    </div>
  );
};

export default GameStats;
