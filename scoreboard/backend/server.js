const express = require('express');
let fetch;
import('node-fetch').then(({ default: nodeFetch }) => {
  fetch = nodeFetch;
});
const WebSocket = require('ws');
const http = require('http');

// Set up the Express server
const app = express();
const server = http.createServer(app);

// Initialize a WebSocket Server instance
const wss = new WebSocket.Server({ server });

// Function to fetch scoreboard data
async function fetchScoreboardData() {
    const response = await fetch('http://localhost:8089/scoreboard-with-achievements');
    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
    }
    return response.json();
}

// Function to broadcast data to all connected WebSocket clients
function broadcastData(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Fetch and send scoreboard data when a new client connects
    fetchScoreboardData()
        .then(data => {
            ws.send(JSON.stringify(data)); // Send data to the newly connected client
        })
        .catch(error => {
            console.error('Error fetching scoreboard data:', error);
            ws.send(JSON.stringify({ error: 'Failed to fetch scoreboard data' }));
        });

    // Optionally handle messages from clients
    ws.on('message', (message) => {
        console.log('Received message from client:', message);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = 4004; 
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
