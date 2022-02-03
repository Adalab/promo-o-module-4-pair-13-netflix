const express = require('express');
const cors = require('cors');
const path = require('path');
const movies = require('./data/movies.json');
const users = require('./data/users.json');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// endpoints
server.get('/movies', (req, res) => {
  res.json({
    success: true,
    movies: movies,
  });
});
server.post('/login', (req, res) => {
  console.log(req.body);
  const foundUser = users.find((user) => user.email === req.body.email);
  res.json({
    success: true,
    movies: movies,
  });
});

const staticServerPath = './src/public-react';
server.use(express.static(staticServerPath));

const staticServerPathImages = './src/public-movies-images';
server.use(express.static(staticServerPathImages));
