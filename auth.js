// in auth.js

const argon2 = require("@node-rs/argon2");
// argon2: argon2id 15mio itérations 2 parallélisme 1

const jwt = require("jsonwebtoken");

const hashingOptions = {
    type: argon2.argon2id,
    //La variante de la fonction de hachage.
    // argon2id est une combinaison hybride 
    memoryCost: 2 ** 16,
    //quantité de mémoire à utiliser
    timeCost: 5,
    //Le coût en temps est le nombre de passes (itérations) utilisées par la fonction de hachage. Il augmente la force de hachage au détriment du temps nécessaire au calcul.
    parallelism: 1,
    //Le nombre de threads sur lesquels calculer le hachage.
};

const hashPassword = (req, res, next) => {
argon2
.hash(req.body.hashedPassword, hashingOptions)
//récupérer le mot de passe à hacher à partir de req.body.password.
  .then((hashedPassword) => {
    
    req.body.hashedPassword = hashedPassword;
    //dois stocker le mot de passe haché dans req.body.hashedPassword.
console.log("coucou" , hashedPassword);
    delete req.body.password;
    //Pour t'assurer que le mot de passe en clair ne pourra plus être utilisé après ton middleware, supprime-le.
    next();
  })
  .catch((err) => {
    res.sendStatus(500)
  });
};


const verifyPassword = (req, res) => {
  argon2
    .verify(req.user.hashedPassword, req.body.password)
    .then((isVerified) => {
      if (isVerified) {
        const payload = { sub: req.user.id };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        delete req.user.hashedPassword;
        res.send({ token, user: req.user });
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};



const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");

    if (authorizationHeader == null) {
      throw new Error("Authorization header is missing");
    }

    const [type, token] = authorizationHeader.split(" ");

    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type");
    }

    req.payload = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};

const checkUserId = (req, res, next) => {
  const userId= res.params.id;
  const authorizationUserId = req.payload.sub;

  if (userId === authorizationUserId) 
  {return res.status(200)
  } else {
    return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à effectuer cette action.' });
  }
  next();
};


module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken, 
  checkUserId,
};

