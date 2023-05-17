const database = require("./database");

const getMovies = (req, res) => {
  database
    .query("select * from movies")
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getMovieById = (req, res) => {
    const id = parseInt(req.params.id);
  
    database
      .query("select * from movies where id = ?", [id])
      .then(([movies]) => {
        if (movies[0] != null) {
          res.json(movies[0]);
        } else {
          res.status(404).send("Not Found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };

  const postMovie = (req, res) => {
    const { title, director, year, color, duration } = req.body;
    

    // utiliser database.query pour écrire ta requête INSERT
    database
    .query (
        "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",

        // ? près du mot-clé SQL VALUES. Ces points d'interrogation seront remplacés par le module mysql2 avant que la requête ne soit réellem nvoyée à la base de données.

        [title, director, year, color, duration]
      )
      .then(([result])=>{
        res.location('api/movies/${result.insertId}').sendStatus(201);


      })
      .catch((err)=>{
        console.error(err);
        res.status(500).send("dont save new movie data");
      });

};



const putMovie= (req, res) => {
  const id = parseInt(req.params.id);
  const {title, director, year, color, duration } = req.body;

  database
  .query (
    "UPDATE movies SET title = ?, director = ?, year = ?, color = ?, duration = ? WHERE id = ?",
    [title, director, year, color, duration, id]
  )
  .then(([result])=> {
    if (result.affectedRows === 1 ) {
      res.status(200).send("it worked");
    } else {
    res.sendStatus(404);
    }
  })
  .catch((err)=>{
    console.error(err);
    res.status(500).send("dont update movie");
  });
};

const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);

  database
  .query("DELETE FROM movies WHERE id=?", [id])
  .then(([result]) => {
    if (result.affectedRows === 0) {
      res.status(404).send("Not found"); 
    } else {
      res.sendStatus(204);
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("No delete movie");
  });
}; 

  module.exports = {
    getMovies,
    getMovieById,
    postMovie,
    putMovie,
    deleteMovie,
  };
  