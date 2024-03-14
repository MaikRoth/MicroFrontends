const express = require('express');
const bodyParser = require('body-parser');
const kafkaConsumer = require('./kafkaConsumer');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
const server = require('http').createServer(app);


app.get('/map', (req, res) => {
  res.json(kafkaConsumer.getMap());
});


const PORT = 4002;
server.listen(PORT, () => {
  kafkaConsumer.init();
  console.log(`Server running on port ${PORT}`);
});
