const WebSocket = require('ws');

let fetch;
import('node-fetch').then(({ default: nodeFetch }) => {
  fetch = nodeFetch;
});
const wss = new WebSocket.Server({ port: 4000 });
let previousData = null;

async function fetchGameData() {
    try {
        const response = await fetch('http://localhost:8080/games');
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch game data:', error);
        return null;
    }
}

function sendDataToClients(data) {
    console.log("Sending data to clients:", data);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

async function checkForUpdates() {
    const data = await fetchGameData();
    if (data && JSON.stringify(data) !== JSON.stringify(previousData)) {
        console.log('Data has changed, sending update to clients.');
        sendDataToClients(data);
        previousData = data;
    }
}

wss.on('connection', function connection(ws) {
    console.log('A new client connected');
  
    ws.on('message', async function incoming(message) { 
      const messageStr = message.toString();
      console.log('received:', messageStr);
      if (messageStr === 'REQUEST_GAME_DATA') {
        try {
          const data = await fetchGameData();
          if (data) {
            console.log('Sending game data to client:', data);
            ws.send(JSON.stringify(data));
          }
        } catch (error) {
          console.error('Error fetching game data for request:', error);
        }
      }
    });
  });

setInterval(checkForUpdates, 1000);

console.log('WebSocket server started on ws://localhost:4000');
