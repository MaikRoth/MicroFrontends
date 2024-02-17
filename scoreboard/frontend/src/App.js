import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 

function App() {
  const [scoreboardData, setScoreboardData] = useState({
    scoreboardEntriesWithAchievements: [] 
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const ws = new WebSocket('ws://localhost:4004');
  
      ws.onopen = () => {
        console.log('WebSocket connected');
      };
  
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setScoreboardData(data);
      };
  
      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };
  
      return () => {
        ws.close();
      };
    }, 30);
  
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <h1>Scoreboard</h1>
        <p><strong>Game ID:</strong> {scoreboardData.gameId}</p>
        <p><strong>Game Status:</strong> {scoreboardData.gameStatus}</p>
        <p><strong>Round Number:</strong> {scoreboardData.roundNumber}</p>
      </div>

      {scoreboardData.scoreboardEntriesWithAchievements && scoreboardData.scoreboardEntriesWithAchievements.length > 0 ? (
        <>
          <div className="table-responsive mb-5">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Fighting Score</th>
                  <th>Mining Score</th>
                  <th>Trading Score</th>
                  <th>Traveling Score</th>
                  <th>Total Score</th>
                </tr>
              </thead>
              <tbody>
                {scoreboardData.scoreboardEntriesWithAchievements.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.player.name}</td>
                    <td>{entry.fightingScore}</td>
                    <td>{entry.miningScore}</td>
                    <td>{entry.tradingScore}</td>
                    <td>{entry.travelingScore}</td>
                    <td><strong>{entry.totalScore}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Achievements</th>
                </tr>
              </thead>
              <tbody>
                {scoreboardData.scoreboardEntriesWithAchievements.map((entry, index) => (
                  <tr key={`achievements-${index}`}>
                    <td>{entry.player.name}</td>
                    <td>
                      {entry.achievements.map((ach, idx) => (
                        <div key={idx} className="d-inline-block me-2">
                          <img src={ach.achievement.image} alt={ach.achievement.name} style={{ maxWidth: "50px", maxHeight: "50px" }} />
                          <p className="text-center">{ach.achievement.name}</p>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
