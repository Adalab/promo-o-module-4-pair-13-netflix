const express = require('express');
const cors = require('cors');
const path = require('path');
const DataBase = require('better-sqlite3');
//const movies = require('./data/movies.json');
//const users = require('./data/users.json');

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
    const query = db.prepare('SELECT * FROM movies WHERE gender = ?');
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

server.get('/movie/:movieId', (req, res) => {
  const foundMovie = movies.find((movie) => movie.id === req.params.movieId);

  res.render('movie', foundMovie);
});

server.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email && password) {
    const query = db.prepare(
      'SELECT * FROM users WHERE email = ? AND password = ?'
    );
    const result = query.get(email, password);

    if (result) {
      res.json({
        success: true,
        userId: result.id,
      });
    } else {
      res.json({
        success: false,
        errorMessage: 'Usuaria/o no encontrada/o',
      });
    }
  } else {
    res.json({
      success: false,
      errorMessage: 'Es obligatorio introducir todos los campos',
    });
  }
});

server.post('/sign-up', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email && password) {
    const queryEmail = db.prepare('SELECT email FROM users WHERE email = ?');
    const resultEmail = queryEmail.get(email);

    if (!resultEmail) {
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
        errorMessage: 'El email ya existe',
      });
    }
  } else {
    res.json({
      success: false,
      errorMessage: 'Es obligatorio introducir todos los campos',
    });
  }
});

server.get('/user/movies', (req, res) => {
  const userId = req.header('user-id');
  console.log(userId);

  const movieIdsQuery = db.prepare(
    'SELECT movieId FROM rel_movies_users WHERE userId = ?'
  );
  const movieIds = movieIdsQuery.all(userId);
  console.log(movieIds);

  if (movieIds.length > 0) {
    const moviesIdsQuestions = movieIds.map((id) => '?').join(', ');
    const moviesIdsNumbers = movieIds.map((movie) => movie.movieId);

    const moviesQuery = db.prepare(
      `SELECT * FROM movies WHERE id IN (${moviesIdsQuestions})`
    );
    const movies = moviesQuery.all(moviesIdsNumbers);

    res.json({
      success: true,
      movies: movies,
    });
  } else {
    res.json({
      success: false,
      errorMessage: 'No hay películas favoritas asociadas a este usuario',
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
