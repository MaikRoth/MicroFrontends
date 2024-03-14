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

const init = async () => {
  console.log('Map consumer running');
  await consumer.connect();
  const topics = ['gameworld', 'planet', 'status'];

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
  console.log('Map:', map.planetsMap);
}
function updatePlanetResource({ planet: planetId, minedAmount, resource }) {
  if (resource) {
    const currentAmount = resource.currentAmount;
    if (map.planetsMap[planetId]) {
      map.planetsMap[planetId].resource.currentAmount = currentAmount;
    }
  }
}

module.exports = {
  init,
  getMap: () => [map] || [],
};
