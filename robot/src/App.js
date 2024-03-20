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
    const fetchRobotsForPlayer = async (player) => {
      try {
        const response = await fetch(`http://localhost:8082/robots?player-id=${player.playerId}`);
        const robots = await response.json();
        console.log('robots', robots);
        return {
          playerName: player.playerName,
          robots: robots.map(robot => ({
            ...robot,
            image: `https://robohash.org/${robot.id}.png`,
            color: player.color,
          })),
        };
      } catch (error) {
        console.error('Error fetching robots data:', error);
        return { playerName: player.playerName, robots: [] };
      }
    };

    const fetchRobots = async () => {
      const robotsData = await Promise.all(playingPlayers.map(fetchRobotsForPlayer));
      const newPlayerRobots = robotsData.reduce((acc, { playerName, robots }) => {
        acc[playerName] = robots;
        return acc;
      }, {});
      setPlayerRobots(newPlayerRobots);
      const mapData = robotsData.flatMap(({ robots }) =>
      robots.map(robot => ({
        id: robot.id,
        player: robot.playerName,
        planet: robot.planet,
        image: robot.image,
        color: robot.color,
      }))
    );

    const robotMapUpdateEvent = new CustomEvent('robotMapUpdate', { detail: { mapData } });
    window.dispatchEvent(robotMapUpdateEvent);
    };

    if (playingPlayers.length > 0) {
      fetchRobots();
      const interval = setInterval(fetchRobots, 5000);
      return () => clearInterval(interval);
    }
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
