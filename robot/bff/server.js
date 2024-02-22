const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const microserviceEndpoint = 'http://localhost:8082/robots';

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
        try {
            const messageString = message.toString();
            const playerIds = JSON.parse(messageString); 

            const promises = playerIds.map(playerId => fetchRobotData(playerId));

            Promise.all(promises)
                .then(results => {
                    const robotsByPlayerId = results.reduce((acc, { playerId, robots }) => {
                        if (!acc[playerId]) acc[playerId] = [];
                        acc[playerId].push(...robots);
                        return acc;
                    }, {});

                    ws.send(JSON.stringify(robotsByPlayerId)); 
                })
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send('Error processing data');
        }
    });
});

function fetchRobotData(playerId) {
    const url = `${microserviceEndpoint}?player-id=${playerId}`;
    return new Promise((resolve, reject) => {
        http.get(url, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const robots = JSON.parse(data);
                    resolve({ playerId, robots }); 
                } catch (parseError) {
                    reject(parseError);
                }
            });
            res.on('error', error => reject(error));
        });
    });
}

const PORT = 4006;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
