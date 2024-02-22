const { Kafka } = require('kafkajs');
const kafka = new Kafka({
  clientId: 'Map',
  brokers: ['localhost:29092']
});

const consumer = kafka.consumer({ groupId: 'mapConsumer' });
const messages = {};
const map = {
  planetsMap: {},
  robotsMap: {}
};

let updateFrontendCallback; 
const init = async (updateCallback) => {
  updateFrontendCallback = updateCallback; 

  await consumer.connect();
  const topics = ['gameworld', 'planet', 'status'];

  for (let topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
    messages[topic] = [];
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const parsedMessage = JSON.parse(message.value.toString());
      const headers = message.headers
      for (const [key, value] of Object.entries(headers)) {
        console.log(`Header key: ${key}, value: ${value.toString()}`);
      }
  
      messages[topic].push(parsedMessage);
      if (topic === 'status' && parsedMessage.status === 'ended') {
        topics.forEach(topic => messages[topic] = []);
        map.grid = [];
        map.planetsMap = {};
      } else if (topic === 'gameworld' && parsedMessage.planets) {
        createMapFromMessage(parsedMessage);
        updateFrontendCallback(map.planetsMap);
      } else if (topic === 'planet') {
        updatePlanetResource(parsedMessage);
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

  // const mapSize = Math.max(maxX, maxY) + 1;
  // map.grid = Array.from({ length: mapSize }, () =>
  //   Array.from({ length: mapSize }, () => null)
  // );

  // Object.values(map.planetsMap).forEach(planet => {
  //   map.grid[planet.y][planet.x] = planet;
  // });

}
function updatePlanetResource({ planet: planetId, minedAmount, resource }) {
  if (resource) {
    const currentAmount = resource.currentAmount;
    if (map.planetsMap[planetId]) {
      map.planetsMap[planetId].resource.currentAmount = currentAmount;
      updateFrontendCallback(map.planetsMap);
    }
  }
}

function addRobotToPlanet(robotInfo) {
  const planetId = robotInfo.robot.planet.planetId;
  const planet = map.planetsMap[planetId];
  if (planet) {
    const robotIndex = planet.robots.findIndex(r => r.id === robotInfo.robot.id);
    const robot = robotInfo.robot;
    
    if (robotIndex !== -1) {
      planet.robots[robotIndex] = robot;
    } else {
      planet.robots.push(robot);
    }
  
    updateFrontendCallback(map.planetsMap); 
  }
}


function moveRobot({ robotId, fromPlanetId, toPlanetId, remainingEnergy }) {
  const fromPlanet = map.planetsMap[fromPlanetId];
  const robot = fromPlanet.robots.find(r => r.id === robotId);
  if (fromPlanet) {
    const robotIndex = fromPlanet.robots.findIndex(r => r.id === robotId);
    if (robotIndex !== -1) fromPlanet.robots.splice(robotIndex, 1);
  }

  const toPlanet = map.planetsMap[toPlanetId];
  if (toPlanet) {
    toPlanet.robots.push(robot);
    updateFrontendCallback(map.planetsMap); 
  }
}

function updateRobotInventory({ robotId, minedResource, minedAmount, resourceInventory }) {
  for (const planet of Object.values(map.planetsMap)) {
    const robot = planet.robots.find(r => r.id === robotId);
    if (robot) {
      robot.inventory.resources = resourceInventory;
      updateFrontendCallback(map.planetsMap); 
      break;
    }
  }
}


module.exports = {
  init,
  getMessages: (topic) => messages[topic] || [],
  getMap: () => map.grid || [],
  getWholeMap: () => [map] || [],
  getPlanetById: (id) => map.planetsMap[id] || null
};
