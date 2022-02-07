const express = require('express');
const cors = require('cors');
const path = require('path');
const movies = require('./data/movies.json');
const users = require('./data/users.json');
const DataBase = require('better-sqlite3');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set('view engine', 'ejs');

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// init and config data base
const db = new Database('./src/db/database.db', {
  // comment next line to hide data base logs in console
  verbose: console.log,
});

// endpoints

server.get('/movies', (req, res) => {
  const query = db.prepare('SELECT * FROM movies');
  const movies = query.all();
  res.json({
    success: true,
    movies: movies,
  });
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

server.get('/movie/:movieId', (req, res) => {
  console.log(req.params.movieId);

  const foundMovie = movies.find((movie) => movie.id === req.params.movieId);
  console.log(foundMovie);

  res.render('movie', foundMovie);
});

// static servers

const staticServerPath = './src/public-react';
server.use(express.static(staticServerPath));

const staticServerPathImages = './src/public-movies-images';
server.use(express.static(staticServerPathImages));

const staticServerPathCSS = './src/public-movies-css';
server.use(express.static(staticServerPathCSS));
