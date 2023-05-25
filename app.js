const express = require("express");
require("dotenv").config();

const app = express();

// Express ne peut pas lire les corps de requête JSON par défaut... Pour que cela fonctionne, nous devons utiliser un middleware express intégré : express.json().
app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);


const userHandlers = require("./userHandlers");

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);

const {validationUser} = require('./validationUser.js');
app.post("/api/users", validationUser, userHandlers.postUser);


app.put("/api/users/:id", validationUser, userHandlers.putUser);
app.delete("/api/users/:id", userHandlers.deleteUser);


const movieHandlers = require("./movieHandlers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

const {validationMovie} = require('./validationMovie.js');
app.post("/api/movies", validationMovie, movieHandlers.postMovie);
app.put("/api/movies/:id",  validationMovie, movieHandlers.putMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);



app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});


