import React, { useState, useEffect } from 'react';
import './GameCard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [maxRounds, setMaxRounds] = useState(200);
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [duration, setDuration] = useState(15000);
  const [gameId, setGameId] = useState('');
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    handleGetGameId();
  }, []);


  const handleCreateGame = async (maxRounds, maxPlayers) => {
    try {
      const response = await fetch('http://localhost:8080/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ maxRounds, maxPlayers }),
      });
      const data = await response.json();
      setGameId(data.gameId);
      triggerGameCardUpdate();
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  const handlePatchMaxRounds = async (newMaxRounds) => {
    handleGetGameId();
    try {
      await fetch(`http://localhost:8080/games/${gameId}/maxRounds`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ maxRounds: newMaxRounds }),
      });
      triggerGameCardUpdate();
    } catch (error) {
      console.error('Error updating max rounds:', error);
    }
  };

  const handlePatchDuration = async (newDuration) => {
    try {
      await fetch(`http://localhost:8080/games/${gameId}/duration`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ duration: newDuration }),
      });
      triggerGameCardUpdate();
    } catch (error) {
      console.error('Error updating duration:', error);
    }
  };

  const handleStartGame = async () => {
    try {
      await fetch(`http://localhost:8080/games/${gameId}/gameCommands/start`, {
        method: 'POST',
      });
      triggerGameCardUpdate();
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const handleEndGame = async () => {
    try {
      await fetch(`http://localhost:8080/games/${gameId}/gameCommands/end`, {
        method: 'POST',
      });
      setGameId('');
      triggerGameCardUpdate();
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  const handleGetGameId = async () => {
    try {
      const response = await fetch('http://localhost:8080/games', { method: 'GET' });
      const data = await response.json();
      if (data) {
        setGameId(data[0].gameId);
      }
      triggerGameCardUpdate();
    } catch (error) {
      console.error('Error getting game ID:', error);
    }
  };

  const triggerGameCardUpdate = () => {
    fetchData();
  };
  return (
    <div>
      {game ? (
        <div className="game-card">
          <div className="flex-container"><h2><strong>Game ID:</strong> {game.gameId}</h2></div>
          <ul>
            <li><strong>Status:</strong> {game.gameStatus}</li>
            <li><strong>Max Players:</strong> {game.maxPlayers}</li>
            <li><div className="flex-container"><strong>Max Rounds:</strong> {game.maxRounds}
              <input
                id="maxRounds"
                type="number"
                value={maxRounds}
                onChange={(e) => setMaxRounds(Number(e.target.value))}
                className="form-control"
              />
              <button onClick={() => handlePatchMaxRounds(maxRounds)} className="btn btn-primary mt-2">
                Patch Max Rounds
              </button>
            </div>
            </li>
            <li><strong>Current Round:</strong> {game.currentRoundNumber || 'N/A'}</li>
            <li><div className="flex-container"><strong>Round Length (ms):</strong> {game.roundLengthInMillis}
              <input
                id="duration"
                type="number"
                placeholder="Duration (ms)"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="form-control"
              />
              <button onClick={() => handlePatchDuration(duration)} className="btn btn-primary mt-2">
                Patch Duration
              </button>
            </div></li>
            <li>
              <strong>Participating Players:</strong>
              <ul>
                {game.participatingPlayers.map(player => (
                  <li key={player}>{player}</li>
                ))}
              </ul>
            </li>
            <section className="game-actions d-flex justify-content-center mb-3">
              <button onClick={handleStartGame} className="btn btn-success me-3">
                Start Game
              </button>
              <button onClick={handleEndGame} className="btn btn-danger">
                End Game
              </button>
            </section>
          </ul>
        </div>
      ) : isLoading ? (
        <div className="loading">Loading game details...</div>
      ) : (
        <div className="loading game-card">
          <h2>No game found. Create a new game:</h2>
          <div className='flex-container'>
            <label htmlFor="maxRounds">Max Rounds:</label>
            <input
              id="maxRounds"
              type="number"
              value={maxRounds}
              onChange={(e) => setMaxRounds(Number(e.target.value))}
              className="form-control"
            />
          </div>
          <div className='flex-container'>
            <label htmlFor="maxRounds">Max Players:</label>
            <input
              id="maxPlayers"
              type="number"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              className="form-control"
            />
          </div>
          <button onClick={() => handleCreateGame(maxRounds, maxPlayers)} className="btn btn-primary mt-2">
              Create Game
            </button>
        </div>
      )}
    </div>

  );
};

export default App;