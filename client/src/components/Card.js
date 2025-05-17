import React from 'react';
import '../assets/css/Card.css';

const Card = ({ card, onClick }) => {
  const handleClick = () => {
    onClick(card);
  };

  // Create class name string with various states
  const classNames = [
    'memory-card',
    card.isFlipped || card.isMatched ? 'flipped' : '',
    card.isMatched ? 'matched' : '',
    card.isRecentlyMatched ? 'recently-matched' : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      onClick={handleClick}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="front-design"></div>
        </div>
        <div className="card-back">
          <span className="card-content">{card.image}</span>
          {card.isMatched && <div className="match-glow"></div>}
        </div>
      </div>
      {card.isRecentlyMatched && <div className="celebration-particles"></div>}
    </div>
  );
};

export default Card;
