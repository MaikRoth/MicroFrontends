import React, { useState, useEffect } from 'react';
import './GameCard.css';

const GameCard = () => {
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const socket = new WebSocket('ws://localhost:4000');

      socket.onopen = () => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send('REQUEST_GAME_DATA');
        }
      };

      socket.onmessage = (event) => {
        setIsLoading(false);
        const data = JSON.parse(event.data);
        if (Array.isArray(data) && data.length > 0) {
          setGame(data[0]);
        } else {
          setGame(null);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsLoading(false);
      };

      return () => {
        socket.close();
      };
    }, 30); 
    return () => clearTimeout(timeoutId);
  }, []);
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

