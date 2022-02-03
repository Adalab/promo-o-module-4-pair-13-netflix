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
  const gender = req.query.gender;

  // filter by gender
  const filteredMovies = movies.filter((movie) =>
    gender === '' ? true : movie.gender === gender
  );

  const response = {
    success: true,
    movies: filteredMovies,
  };

  res.json(response);
});

server.post('/login', (req, res) => {
  const foundUser = users.find(
    (user) =>
      user.email === req.body.email && user.password === req.body.password
  );

  let response = {};
  if (foundUser) {
    response = {
      success: true,
      userId: foundUser.id,
    };
  } else {
    response = {
      success: false,
      errorMessage: 'Usuaria/o no encontrada/o',
    };
  }
  res.json(response);
});

// static servers

const staticServerPath = './src/public-react';
server.use(express.static(staticServerPath));

const staticServerPathImages = './src/public-movies-images';
server.use(express.static(staticServerPathImages));
