import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import GameStats from '../components/GameStats';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import '../assets/css/Game.css';

const Game = () => {
  const {
    startGame,
    cards,
    flippedCards,
    matchedCards,
    flipCard,
    gameStarted,
    gameOver,
    moves,
    score,
    currentLevel,
    nextLevel
  } = useGame();

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);
  const boardRef = useRef(null);

  // Animation for card matching
  const [lastMatchedCards, setLastMatchedCards] = useState([]);
  // Start the game when component mounts if not already started
  useEffect(() => {
    if (!gameStarted && !gameOver) {
      // Start at the user's level if authenticated, otherwise level 1
      const startLevel = isAuthenticated && user ? Math.min(user.level, 3) : 1;
      startGame(startLevel);
    }

    // Show welcome animation
    setTimeout(() => {
      setShowAnimation(true);
    }, 300);
  }, [gameStarted, gameOver, startGame, isAuthenticated, user]);

  // Track matched cards for animation
  useEffect(() => {
    if (matchedCards.length > 0 && matchedCards.length % 2 === 0) {
      const newMatches = matchedCards.slice(-2);
      setLastMatchedCards(newMatches);

      // Clear after animation
      setTimeout(() => {
        setLastMatchedCards([]);
      }, 1500);
    }
  }, [matchedCards]);

  // Is a card flipped or matched
  const isFlipped = (card) => {
    return flippedCards.some(c => c.id === card.id) || matchedCards.includes(card.id);
  };

  // Handle card click
  const handleCardClick = (card) => {
    if (flippedCards.length < 2 && !matchedCards.includes(card.id) && !flippedCards.some(c => c.id === card.id)) {
      flipCard({ ...card, isFlipped: true });
    }
  };

  // Handle level up button click
  const handleLevelUp = () => {
    nextLevel();
  };

  // Handle restart button click
  const handleRestart = () => {
    startGame(currentLevel);
  };
  return (
    <div className={`game-container ${showAnimation ? 'fade-in' : ''}`}>
      <div className="mantra-banner">
        <div className="mantra-symbol">ॐ</div>
        <p>Focus your mind on the cards to achieve harmony</p>
      </div>

      <GameStats />

      {gameOver ? (
        <div className="game-over">
          <h2>Chakra Unlocked!</h2>
          <div className="celebration-animation"></div>

          <div className="game-results">
            <p>Moves: <span>{moves}</span></p>
            <p>Score: <span>{score}</span></p>
            <p>Level: <span>{currentLevel}</span></p>
          </div>

          <div className="game-options">
            {currentLevel < 3 ? (
              <button className="level-up-btn" onClick={handleLevelUp}>
                <span className="btn-icon">⬆</span> Ascend Higher
              </button>
            ) : (
              <p className="max-level">✨ You have reached the highest state of enlightenment! ✨</p>
            )}
            <button className="restart-btn" onClick={handleRestart}>
              <span className="btn-icon">↻</span> Begin Again
            </button>
            <button className="leaderboard-btn" onClick={() => navigate('/leaderboard')}>
              <span className="btn-icon">🏆</span> Hall of Seekers
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="level-indicator">
            <div className="level-lotus">
              {Array(currentLevel).fill().map((_, i) => (
                <span key={i} className="lotus-petal">☸</span>
              ))}
            </div>
            <span className="level-text">Chakra Level {currentLevel}</span>
          </div>

          <div className="game-board" ref={boardRef}>
            {cards.map(card => (
              <Card
                key={card.id}
                card={{
                  ...card,
                  isFlipped: isFlipped(card),
                  isMatched: matchedCards.includes(card.id),
                  isRecentlyMatched: lastMatchedCards.includes(card.id)
                }}
                onClick={handleCardClick}
              />
            ))}
            <div className="board-decorations">
              <span className="corner-decoration top-left"></span>
              <span className="corner-decoration top-right"></span>
              <span className="corner-decoration bottom-left"></span>
              <span className="corner-decoration bottom-right"></span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
