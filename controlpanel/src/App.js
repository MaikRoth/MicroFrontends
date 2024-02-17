import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [maxRounds, setMaxRounds] = useState(200);
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [duration, setDuration] = useState(15000);
  const [gameId, setGameId] = useState('');

  const handleCreateGame = async (maxRounds, maxPlayers) => {
    console.log('maxRounds:', maxRounds);
    console.log('maxPlayers:', maxPlayers);
    try {
      const response = await fetch('http://localhost:8080/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ maxRounds, maxPlayers }),
      });
      const data = await response.json();
      console.log('game creation data:', data);
      setGameId(data.gameId);
     // alert('Game created successfully!');
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Failed to create game. ');
    }
  };

  const handlePatchMaxRounds = async (newMaxRounds) => {
    try {
      await fetch(`http://localhost:8080/games/${gameId}/maxRounds`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ maxRounds: newMaxRounds }),
      });
     // alert('Max Rounds updated successfully!');
    } catch (error) {
      console.error('Error updating max rounds:', error);
      alert('Failed to update max rounds.');
    }
  };

  const handlePatchDuration = async (newDuration) => {
    console.log('newDuration:', newDuration);
    try {
      await fetch(`http://localhost:8080/games/${gameId}/duration`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ duration: newDuration }),
      });
     // alert('Duration updated successfully!');
    } catch (error) {
      console.error('Error updating duration:', error);
      alert('Failed to update duration.');
    }
  };

  const handleStartGame = async () => {
    try {
      await fetch(`http://localhost:8080/games/${gameId}/gameCommands/start`, {
        method: 'POST',
      });
      //alert('Game started successfully!');
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game.');
    }
  };

  const handleEndGame = async () => {
    try {
      await fetch(`http://localhost:8080/games/${gameId}/gameCommands/end`, {
        method: 'POST',
      });
      setGameId('');
      //alert('Game ended successfully!');
    } catch (error) {
      console.error('Error ending game:', error);
      alert('Failed to end game.');
    }
  };

  const handleGetGameId = async () => {
    try {
      const response = await fetch('http://localhost:8080/games', { method: 'GET' });
      const data = await response.json();
      if (data) {
        setGameId(data[0].gameId);
        //alert('Game ID fetched successfully! Game ID: ' + data[0].gameId);
      }
    } catch (error) {
      console.error('Error fetching game ID:', error);
      alert('Failed to fetch game ID.');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 shadow-sm p-3 mb-5 bg-white rounded">
          <h2>Control Panel</h2>

          <section className="game-id d-flex align-items-center mb-3">
            <h4>Game ID: {gameId}</h4>
            <button onClick={handleGetGameId} className="btn btn-primary ms-auto">
              Get Game ID
            </button>
          </section>

          <section className="game-settings mb-3">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="maxRounds">Max Rounds:</label>
                <input
                  id="maxRounds"
                  type="number"
                  value={maxRounds}
                  onChange={(e) => setMaxRounds(Number(e.target.value))}
                  className="form-control"
                />
                <label htmlFor="maxRounds">Max Players:</label>
                <input
                  id="maxPlayers"
                  type="number"
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="form-control"
                />
                <button onClick={() => handleCreateGame(maxRounds, maxPlayers)} className="btn btn-primary mt-2">
                  Create Game
                </button>
                <button onClick={() => handlePatchMaxRounds(maxRounds)} className="btn btn-primary mt-2">
                  Patch Max Rounds
                </button>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="duration">Round Duration (ms):</label>
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
              </div>
            </div>
          </section>

          <section className="game-actions d-flex justify-content-center mb-3">
            <button onClick={handleStartGame} className="btn btn-success me-3">
              Start Game
            </button>
            <button onClick={handleEndGame} className="btn btn-danger">
              End Game
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default App;
