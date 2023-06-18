const database = require("./database");

// const getUsers = (req, res) => {
//   database
//     .query("select * from users")
//     .then(([users]) => {
//       res.json(users);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send("Error retrieving data from database");
//     });
// };

const getUsers = (req, res) => {
  const initialSql = "select * from users";
  const where = [];

  if (req.query.language != null) {
    where.push({
      column: "language",
      value: req.query.language,
      operator: "=",
    });
  }
  if (req.query.city != null) {
    where.push({
      column: "city",
      value: req.query.city,
      operator: "=",
    });
  }

  database
    .query(
      where.reduce(
        (sql, { column, operator }, index) =>
          `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`,
        initialSql
      ),
      where.map(({ value }) => value)
    )
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
  const {firstname, lastname, email, city, language,  hashedPassword } =
  req.body;

  database
  .query (
    "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
    [firstname, lastname, email, city, language,  hashedPassword]
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
  const {firstname, lastname, email, city, language,  hashedPassword} =
  req.body;

  database
  .query (
    "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ?,  hashedPassword = ? WHERE id = ?",
    [firstname, lastname, email, city, language,  hashedPassword, id]
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

const deleteUser = (req, res)=> {
  const id = parseInt(req.params.id);

  database
  .query("DELETE FROM USERS WHERE id=?" , [id])
  .then(([result]) => {
    if (result.affectedRows === 0) {
      res.status(404).send("Not found"); 
    } else {
      res.sendStatus(204);
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("No delete user");
  });
}; 



// requete pr login
const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
  const { email } = req.body;

  database
    .query("select * from users where email = ?", [email])
    .then(([users]) => {
      if (users[0] != null) {
        req.user = users[0];

        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};


module.exports = {
    getUsers,
    getUserById,
    postUser,
    putUser,
    deleteUser,
    getUserByEmailWithPasswordAndPassToNext,
  };
  