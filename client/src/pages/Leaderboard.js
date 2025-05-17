import React, { useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import '../assets/css/Leaderboard.css';

const Leaderboard = () => {
  const { leaderboard, userScores, fetchLeaderboard, fetchUserScores, loading } = useGame();
  // Use an empty dependency array with eslint disable to fetch data only once when component mounts
  useEffect(() => {
    fetchLeaderboard();
    fetchUserScores();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <div className="header-decoration left"></div>
        <h1>Hall of Seekers</h1>
        <div className="header-decoration right"></div>
      </div>

      <div className="leaderboard-section">
        <div className="section-decoration top-left"></div>
        <div className="section-decoration top-right"></div>
        <h2><span className="title-icon">🏆</span> Master Seekers</h2>
        {loading ? (
          <p className="loading">Consulting the ancient scrolls...</p>
        ) : leaderboard.length > 0 ? (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Seeker</th>
                <th>Chakra</th>
                <th>Enlightenment</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => (
                <tr key={player._id} className={index < 3 ? `top-${index + 1}` : ''}>
                  <td className="rank">{index + 1}</td>
                  <td>{player.username}</td>
                  <td className="level">Level {player.level}</td>
                  <td className="score">{player.highScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">The path to enlightenment awaits its first seekers.</p>
        )}
      </div>      {userScores && userScores.length > 0 && (
        <div className="leaderboard-section personal-journey">
          <div className="section-decoration bottom-left"></div>
          <div className="section-decoration bottom-right"></div>
          <h2><span className="title-icon">🧘</span> Your Spiritual Journey</h2>
          <table className="leaderboard-table user-scores">
            <thead>
              <tr>
                <th>Moon Day</th>
                <th>Chakra</th>
                <th>Enlightenment</th>
                <th>Meditation Time</th>
              </tr>
            </thead>
            <tbody>
              {userScores.map(game => (
                <tr key={game._id}>
                  <td>{formatDate(game.date)}</td>
                  <td className="level">Level {game.level}</td>
                  <td className="score">{game.score}</td>
                  <td className="time-cell">{Math.floor(game.timeTaken / 60)}:{(game.timeTaken % 60).toString().padStart(2, '0')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="journey-quote">
            <p>"The journey of a thousand miles begins with a single step."</p>
            <div className="quote-author">- Ancient Wisdom</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
