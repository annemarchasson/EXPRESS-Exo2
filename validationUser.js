const { body, validationResult } = require('express-validator');

const validationUser = [
    body("firstname").isLength({max:255}),
    body("lastname").isLength({max:255}),
    body("email").isEmail(),
    body("city").isLength({max:100}),
    body("language").isLength({max:100}),
    body(" hashedPassword").isLength({max:600}),
    (req, res, next) => {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          res.status(422).json({ validationErrors: errors.array() });
        } else {
          next();
        }
      },
    ];

module.exports = { 
    validationUser,
};