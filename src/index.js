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

server.post('/user/profile', (req, res) => {
  const id = req.headers['user-id'];
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (id && name && email && password) {
    const query = db.prepare(
      'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?'
    );
    const result = query.run(name, email, password, id);

    if (result && result.changes === 1) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } else {
    res.json({ success: false });
  }
});

server.get('/user/profile', (req, res) => {
  const id = req.headers['user-id'];

  if (id) {
    const query = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = query.get(id);

    if (user) {
      res.json(user);
    }
  }
});

// static servers

const staticServerPath = './src/public-react';
server.use(express.static(staticServerPath));

const staticServerPathImages = './src/public-movies-images';
server.use(express.static(staticServerPathImages));

const staticServerPathCSS = './src/public-movies-css';
server.use(express.static(staticServerPathCSS));
