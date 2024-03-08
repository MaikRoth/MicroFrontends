import React, { useState, useEffect } from 'react';
import './GameCard.css';

const GameCard = () => {
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/games');
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }
      const data = await response.json();
      setGame(data[0]);
      setIsLoading(false);
    } catch (error) {
      setError(error.toString());
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();

    const handleUpdate = () => fetchData();
    window.addEventListener('updateGameCard', handleUpdate);

    return () => window.removeEventListener('updateGameCard', handleUpdate);
  }, []);

  if (isLoading) return <div className="loading">Loading game details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!game) return <div className="loading">No game details available.</div>;

  return (
    <div>
      {game ? (
        <div className="game-card">
          <h2>Game Details</h2>
          <ul>
            <li><strong>Game ID:</strong> {game.gameId}</li>
            <li><strong>Status:</strong> {game.gameStatus}</li>
            <li><strong>Max Players:</strong> {game.maxPlayers}</li>
            <li><strong>Max Rounds:</strong> {game.maxRounds}</li>
            <li><strong>Current Round:</strong> {game.currentRoundNumber || 'N/A'}</li>
            <li><strong>Round Length (ms):</strong> {game.roundLengthInMillis}</li>
            <li>
              <strong>Participating Players:</strong>
              <ul>
                {game.participatingPlayers.map(player => (
                  <li key={player}>{player}</li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      ) : isLoading ? (
        <div className="loading">Loading game details...</div>
      ) : (
        <div className="loading">No game details available.</div>
      )}
    </div>
  );
};

export default GameCard;

