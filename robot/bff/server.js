const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { log } = require('console');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/get-robots', (req, res) => {
    console.log('Request received', req.body);
    const players = req.body;
    const promises = players.map(player => 
        fetchRobotData(player.playerId).then((robots) => ({
            playerId: player.playerId,
            playerName: player.playerName,
            robots 
        }))
    );

    Promise.all(promises)
        .then(results => {
            res.json(results);
        })
        .catch(error => {
            console.error('Error fetching robot data:', error);
            res.status(500).send('Error processing data');
        });
});

function fetchRobotData(playerId) {
    const url = `http://localhost:8082/robots?player-id=${playerId}`;
    return new Promise((resolve, reject) => {
        http.get(url, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const robots = JSON.parse(data); 
                    resolve(robots); 
                } catch (parseError) {
                    reject(parseError);
                }
            });
            res.on('error', error => reject(error));
        });
    });
}

const PORT = 4006;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});