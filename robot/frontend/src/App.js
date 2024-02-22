import React, { useState, useEffect } from 'react';

function App() {
  const [playingPlayers, setPlayingPlayers] = useState([]);
  const [playerRobots, setPlayerRobots] = useState({}); 
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const bffUrl = 'ws://localhost:4006';
    const newWs = new WebSocket(bffUrl);

    newWs.onopen = () => {
      console.log('WebSocket connection established');
      setWs(newWs);
    };

    newWs.onmessage = (event) => {
      try {
        const robotsData = JSON.parse(event.data);
        const mapData = Object.values(robotsData).flatMap(robotsArray => 
          robotsArray.map(robot => ({
            id: robot.id,
            player: robot.player,
            planet: robot.planet,
            image: `https://robohash.org/${robot.id}.png`
          }))
        )
        const robotMapUpdate = new CustomEvent('robotMapUpdate', {
          detail: { mapData },
        });
        window.dispatchEvent(robotMapUpdate);
        setPlayerRobots(robotsData);
      } catch (error) {
        console.error('Error parsing robots data:', error);
      }
    };

    return () => {
      if (newWs) newWs.close();
    };
  }, []);

  useEffect(() => {
    const handlePlayingPlayersUpdate = (event) => {
      console.log('Event received: Updating playing players');
      setPlayingPlayers(event.detail.playingPlayers);
    };

    window.addEventListener('playingPlayersUpdate', handlePlayingPlayersUpdate);

    return () => {
      window.removeEventListener('playingPlayersUpdate', handlePlayingPlayersUpdate);
    };
  }, []);

  useEffect(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(playingPlayers));
    }
  }, [playingPlayers, ws]);

  return (
    <div className="container">
      {playingPlayers.length > 0 ? (
        <ul className="list-group">
        </ul>
      ) : (
        <p>Nothing to show</p>
      )}
    </div>
  );
}

export default App;
