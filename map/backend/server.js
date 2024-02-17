const express = require('express');
const bodyParser = require('body-parser');
const kafkaConsumer = require('./kafkaConsumer');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/map', (req, res) => {
  res.json(kafkaConsumer.getMap());
});

app.get('/wholemap', (req, res) => {
  res.json(kafkaConsumer.getWholeMap());
});

const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('A new client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

function broadcastData(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

function updateFrontend(data) {
  broadcastData(data);
}

kafkaConsumer.init(updateFrontend);

const PORT = 4002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
