import React, { useState, useEffect } from 'react';
import { Collapse, Card, Button, Row, Col } from 'react-bootstrap';


function App() {
  const [playingPlayers, setPlayingPlayers] = useState([]);
  const [playerRobots, setPlayerRobots] = useState({});
  const [openPlayers, setOpenPlayers] = useState({});
  const [openRobots, setOpenRobots] = useState({});

  const togglePlayerSection = playerId => {
    setOpenPlayers(prev => ({ ...prev, [playerId]: !prev[playerId] }));
  };

  const toggleRobotDetails = (playerId, robotId) => {
    const key = `${playerId}-${robotId}`;
    setOpenRobots(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const fetchRobots = async () => {
      if (playingPlayers.length > 0) {
        try {
          const response = await fetch('http://localhost:4006/get-robots', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(playingPlayers),
          });
          const robotsData = await response.json();
          const mapData = Object.values(robotsData).flatMap(({ playerName, robots }) =>
            robots.map(robot => ({
              id: robot.id,
              player: playerName,
              planet: robot.planet,
              image: `https://robohash.org/${robot.id}.png`,
              color: playingPlayers.find(player => player.playerName === playerName).color,
            }))
          );
          const robotMapUpdate = new CustomEvent('robotMapUpdate', {
            detail: { mapData },
          });
          window.dispatchEvent(robotMapUpdate);
          const newPlayerRobots = {};
          robotsData.forEach(({ playerName, robots }) => {
            newPlayerRobots[playerName] = robots;
          });
          setPlayerRobots(newPlayerRobots);
        } catch (error) {
          console.error('Error fetching robots data:', error);
        }
      }
    };

    const interval = setInterval(() => {
      fetchRobots();
    }, 5000);

    return () => clearInterval(interval);
  }, [playingPlayers]);


  useEffect(() => {
    const handlePlayingPlayersUpdate = (event) => {
      setPlayingPlayers(event.detail.playingPlayers);
    };

    window.addEventListener('playingPlayersUpdate', handlePlayingPlayersUpdate);

    return () => {
      window.removeEventListener('playingPlayersUpdate', handlePlayingPlayersUpdate);
    };
  }, []);


  return (
    <div className="container">
      <Row>
        {Object.entries(playerRobots).length > 0 ? (
          Object.entries(playerRobots).map(([playerName, robots]) => (
            <Col key={playerName} sm={12} md={6} lg={4} xl={3}>
              <div>
                <Button
                  onClick={() => togglePlayerSection(playerName)}
                  aria-controls={`player-section-${playerName}`}
                  aria-expanded={openPlayers[playerName]}
                  className="mb-2 w-100"
                  style={{ backgroundColor: playingPlayers.find(player => player.playerName === playerName).color }}
                >
                  Player: {playerName}
                </Button>
                <Collapse in={openPlayers[playerName]}>
                  <div id={`player-section-${playerName}`}>
                    <Card className="mb-3">
                      <Card.Header>
                        <h5>Robots: {robots.length}</h5>
                      </Card.Header>
                      <Card.Body>
                        <ul className="list-group">
                          {robots.map(robot => (
                            <li key={robot.id} className="list-group-item">
                              <div className="d-flex justify-content-between align-items-center">
                                <Button
                                  variant="link"
                                  onClick={() => toggleRobotDetails(playerName, robot.id)}
                                  aria-controls={`collapse-text-${robot.id}`}
                                  aria-expanded={openRobots[`${playerName}-${robot.id}`]}
                                >
                                  <div>
                                    {robot.id.substring(0, 5)}
                                    <img src={`https://robohash.org/${robot.id}.png`} alt="robot" style={{width: '50px', height: '50px'}} />                                  </div>
                                </Button>
                                <Collapse in={openRobots[`${playerName}-${robot.id}`]}>
                                  <div id={`collapse-text-${robot.id}`}>
                                    <Card>
                                      <Card.Body>
                                        <p>Planet: {robot.planet}</p>
                                        <p>Health: {robot.health} / {robot.maxHealth}</p>
                                        <p>Energy: {robot.energy} / {robot.maxEnergy}</p>
                                      </Card.Body>
                                    </Card>
                                  </div>
                                </Collapse>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </Card.Body>
                    </Card>
                  </div>
                </Collapse>
              </div>
            </Col>
          ))
        ) : (
          <p>Nothing to show</p>
        )}
      </Row>
    </div>
  );
}


export default App;
