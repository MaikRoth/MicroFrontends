import React from 'react';
import './PlanetsGrid.css';

const PlanetsGrid = ({ planets }) => {
  const gridSize = 15;
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

  planets.forEach(planet => {
    if (grid[planet.y] && grid[planet.y][planet.x] === null) {
      grid[planet.y][planet.x] = planet;
    }
  });

  let planetCount = 0;
  let emptyCount = 0;
  grid.forEach(row => {
    row.forEach(cell => {
      if (cell) {
        planetCount += 1;
      } else {
        emptyCount += 1;
      }
    });
  });

  return (
    <>
      <div className="counts">
        <span>Planets: {planetCount}</span>
        <span>Black Holes: {emptyCount}</span>
      </div>

      <div className="grid">
        {grid.map((row, y) => (
          <div key={y} className="row">
            {row.map((cell, x) => (
              <div key={x} className={`cell ${cell ? 'planet' : 'empty'}`}>
                {cell && cell.resource ? (
                  <>
                    <div className="resource-type">[{cell.resource.resourceType || ''}]</div>
                    <div className="resource-amount">{formatResourceAmount(cell.resource.currentAmount)}</div>
                  </>
                ) : ''}
                {cell && cell.robots && (
                  <div className="robots">
                    {cell.robots.length > 4 ? (
                      <span key="robots-count">+{cell.robots.length} robots</span>
                    ) : (
                      cell.robots.map(robot => (
                        <img key={`robot-${robot.id}`} src={`https://robohash.org/${robot.id}`} alt="robot" className="robot-image" />
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

function formatResourceAmount(amount) {
  if (amount >= 1000) {
    const thousands = Math.floor(amount / 1000);
    const hundred = Math.floor((amount % 1000) / 100);
    return `${thousands}.${hundred}k`;
  }
  return amount.toString();
}

export default PlanetsGrid;
