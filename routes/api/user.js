const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const connection = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const middleware = require('../../middleware/middleware');

//Register
//route POST api/user
//required form data: name, email, password
//if error send error message(msg) object in msg array
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please inculde a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      //check user exists
      let sql = `SELECT * FROM user WHERE email = '${email}'`;
      connection.query(sql, async (error, user) => {
        if (error) {
          console.log(error);
          res.status(500).send('Server Error');
        }
        console.log(user.length);
        // user exists
        if (user.length > 0) {
          res.status(400).json({ msg: [{ msg: 'User already exists' }] });
        }
        // does not exist
        else {
          const salt = await bcrypt.genSalt(10);
          const bcryptPassword = await bcrypt.hash(password, salt);
          console.log(bcryptPassword);
          sql = `INSERT INTO user (name, email, password) VALUES ('${name}', '${email}', '${bcryptPassword}')`;
          connection.query(sql, (error2, result) => {
            if (error2) {
              console.error(error2);
              return res.status(500).send('sever error');
            }
            console.log(result);
            const payload = {
              user: {
                id: result.insertId,
              },
            };
            //expires time 1hour
            jwt.sign(
              payload,
              config.get('jwtSecret'),
              { expiresIn: 360000 },
              (err, token) => {
                if (err) {
                  throw err;
                }
                res.json({ token });
              }
            );
          });
        }
      });
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
