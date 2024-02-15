const { Kafka } = require('kafkajs');
const kafka = new Kafka({
  clientId: 'Map',
  brokers: ['localhost:29092']
});

const consumer = kafka.consumer({ groupId: 'mapConsumer' });
const messages = {};
const map = {
  grid: [],
  planetsMap: {},
  robotsMap: {}
};

let updateFrontendCallback; 
const init = async (updateCallback) => {
  updateFrontendCallback = updateCallback; 

  await consumer.connect();
  const topics = ['gameworld', 'planet', 'status', 'robot'];

  for (let topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
    messages[topic] = [];
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const parsedMessage = JSON.parse(message.value.toString());
      messages[topic].push(parsedMessage);
      if (topic === 'status' && parsedMessage.status === 'ended') {
        topics.forEach(topic => messages[topic] = []);
        map.grid = [];
        map.planetsMap = {};
      } else if (topic === 'gameworld' && parsedMessage.planets) {
        createMapFromMessage(parsedMessage);
        updateFrontendCallback(map.grid);
      } else if (topic === 'planet') {
        updatePlanetResource(parsedMessage);
      }else  if (topic === 'robot') {
        if (parsedMessage.robot && parsedMessage.robot.player) {
          addRobotToPlanet(parsedMessage);
        }
        else if (parsedMessage.fromPlanet && parsedMessage.toPlanet) {
          moveRobot({
            robotId: parsedMessage.robotId,
            fromPlanetId: parsedMessage.fromPlanet.id,
            toPlanetId: parsedMessage.toPlanet.id,
            remainingEnergy: parsedMessage.remainingEnergy
          });
        }
        else if (parsedMessage.minedResource && parsedMessage.resourceInventory) {
          updateRobotInventory({
            robotId: parsedMessage.robotId,
            minedResource: parsedMessage.minedResource,
            minedAmount: parsedMessage.minedAmount,
            resourceInventory: parsedMessage.resourceInventory
          });
        }
      }
    },
  });
};

function createMapFromMessage(message) {
  let planets = message.planets;
  let maxX = 0;
  let maxY = 0;
  planets.forEach(planet => {
    if (planet.x > maxX) maxX = planet.x;
    if (planet.y > maxY) maxY = planet.y;
    map.planetsMap[planet.id] = { ...planet, robots: [] };
  });

  const mapSize = Math.max(maxX, maxY) + 1;
  map.grid = Array.from({ length: mapSize }, () =>
    Array.from({ length: mapSize }, () => null)
  );

  Object.values(map.planetsMap).forEach(planet => {
    map.grid[planet.y][planet.x] = planet;
  });

}
function updatePlanetResource({ planet: planetId, minedAmount, resource }) {
  let planet = map.planetsMap[planetId];
  if (resource) {
    const currentAmount = resource.currentAmount;
    if (planet) {
      map.grid[planet.y][planet.x].resource.currentAmount = currentAmount;
      updateFrontendCallback(map.grid);
    }
  }
}

function addRobotToPlanet(robotInfo) {
  const planet = map.planetsMap[robotInfo.robot.planet.planetId];
  if (planet) {
    const robot = { ...robotInfo, planetId: robotInfo.robot.planet.planetId }; 
    planet.robots.push(robot);
    updateFrontendCallback(map.grid); 
  }
}


function moveRobot({ robotId, fromPlanetId, toPlanetId, remainingEnergy }) {
  const fromPlanet = map.planetsMap[fromPlanetId];
  if (fromPlanet) {
    const robotIndex = fromPlanet.robots.findIndex(r => r.id === robotId);
    if (robotIndex !== -1) fromPlanet.robots.splice(robotIndex, 1);
  }

  const toPlanet = map.planetsMap[toPlanetId];
  if (toPlanet) {
    const robot = { id: robotId, planetId: toPlanetId, energy: remainingEnergy };
    toPlanet.robots.push(robot);
    updateFrontendCallback(map.grid); 
  }
}

function updateRobotInventory({ robotId, minedResource, minedAmount, resourceInventory }) {
  for (const planet of Object.values(map.planetsMap)) {
    console.log(planet);
    const robot = planet.robots.find(r => r.id === robotId);
    if (robot) {
      robot.inventory.resources = resourceInventory;
      updateFrontendCallback(map.grid); 
      break;
    }
  }
}


module.exports = {
  init,
  getMessages: (topic) => messages[topic] || [],
  getMap: () => map.grid || [],
  getPlanetById: (id) => map.planetsMap[id] || null
};
