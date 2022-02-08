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
const db = new DataBase('./src/db/database.db', {
  // comment next line to hide data base logs in console
  verbose: console.log,
});

// endpoints

server.get('/movies', (req, res) => {
  const gender = req.query.gender;
  if (gender) {
    const query = db.prepare('SELECT * FROM movies WHERE gender = ? ');
    const movies = query.all(gender);
    res.json({
      success: true,
      movies: movies,
    });
  } else {
    const queryAllMovies = db.prepare('SELECT * FROM movies');
    const allMovies = queryAllMovies.all();
    res.json({
      success: true,
      movies: allMovies,
    });
  }
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

server.post('/sign-up', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email && password) {
    const queryEmail = db.prepare('SELECT email FROM users WHERE email = ? ');
    const resultEmail = queryEmail.all(email);

    if (resultEmail.length === 0) {
      const query = db.prepare(
        'INSERT INTO users (email, password) VALUES (?, ?)'
      );
      const result = query.run(email, password);

      res.json({
        success: true,
        userId: result.lastInsertRowid,
      });
    } else {
      res.json({
        success: false,
        error: 'el email ya existe',
      });
    }
  } else {
    res.json({
      success: false,
      error: 'es obligatorio introductor email y contraseña',
    });
  }
});

// static servers

const staticServerPath = './src/public-react';
server.use(express.static(staticServerPath));

const staticServerPathImages = './src/public-movies-images';
server.use(express.static(staticServerPathImages));

const staticServerPathCSS = './src/public-movies-css';
server.use(express.static(staticServerPathCSS));
