const express = require("express");
require("dotenv").config();
const app = express();

// Express ne peut pas lire les corps de requête JSON par défaut... Pour que cela fonctionne, nous devons utiliser un middleware express intégré : express.json().
app.use(express.json());

const port = process.env.APP_PORT ?? 5000;
const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

const userHandlers = require("./userHandlers");
const {validationUser} = require('./validationUser.js');
const movieHandlers = require("./movieHandlers");
const {validationMovie} = require('./validationMovie.js');
const {hashPassword, verifyPassword, verifyToken, checkUserId} = require("./auth.js");



app.get("/", welcome);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", hashPassword, userHandlers.getUserById);
app.post("/api/users", validationUser, hashPassword, userHandlers.postUser);

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.post("/api/login",verifyToken, userHandlers.getUserByEmailWithPasswordAndPassToNext,
verifyPassword);

app.use(verifyToken); 
// authentication wall : verifyToken is activated
app.post("/api/movies", validationMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validationMovie, movieHandlers.putMovie);
app.delete("/api/movies/:id",verifyToken, movieHandlers.deleteMovie);

app.put("/api/users/:id", validationUser, checkUserId, hashPassword, userHandlers.putUser);
app.delete("/api/users/:id", checkUserId, userHandlers.deleteUser);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});

// in app.js

const isItDwight = (req, res) => {
  if (req.body.email === "dwight@theoffice.com" && req.body.password === "123456") {
    res.send("Credentials are valid");
  } else {
    res.sendStatus(401);
  }
};

app.post("/api/login", isItDwight);

  


