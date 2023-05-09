const database = require("./database");

const getUsers = (req, res) => {
  database
    .query("select * from users")
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
  
    database
    .query("select * from users where id = ?", [id])
    .then(([users]) => {
      if (users[0] != null) {
        res.json(users[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};


const postUser =(req, res)=>{
  const {firstname, lastname, email, city, language } =
  req.body;

  database
  .query (
    "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
    [firstname, lastname, email, city, language]
  )
  .then(([result])=>{
    res.location('api/users/${result.insertId}').sendStatus(201);
  })
  .catch((err)=>{
    console.error(err);
    res.status(500).send("dont save new user");
  });

}

const putUser = (req, res) =>{
  const id = parseInt(req.params.id);
  const {firstname, lastname, email, city, language} =
  req.body;

  database
  .query (
    "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id = ?",
    [firstname, lastname, email, city, language, id]
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
    res.status(500).send("dont update user");
  });
};


module.exports = {
    getUsers,
    getUserById,
    postUser,
    putUser
  };
  