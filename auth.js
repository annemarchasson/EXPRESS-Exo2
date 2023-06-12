// in auth.js

const argon2 = require("@node-rs/argon2");
// argon2: argon2id 15mio itérations 2 parallélisme 1

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

const  hashPassword = (req, res, next) => {
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

module.exports = {
   hashPassword,
};

