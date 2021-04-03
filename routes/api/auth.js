const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const connection = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const middleware = require('../../middleware/middleware');
const admin = require('../../admin.json');

//@route POST api/v1/auth
//@desc login user and return token
//formData: email, password
router.post(
  '/',
  [
    check('email', 'Please inculde a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    admin.POST['/api/v1/auth']++;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ msg: errors.array() });
    }
    const { email, password } = req.body;
    try {
      //check user exists
      let sql = `SELECT * FROM user WHERE email = '${email}'`;
      connection.query(sql, async (error, user) => {
        if (error) {
          console.log(error);
          res.status(500).send('Server Error');
        }
        // user does not exist
        if (user.length === 0) {
          res.status(400).json({ msg: [{ msg: 'Invalid credentials' }] });
        }
        // user exist
        else {
          const isMatch = await bcrypt.compare(password, user[0].password);
          if (!isMatch) {
            res.status(400).json({ msg: [{ msg: 'Invalid credentials' }] });
          } else {
            const payload = {
              user: {
                id: user[0].userId,
              },
            };
            jwt.sign(
              payload,
              config.get('jwtSecret'),
              { expiresIn: 360000 },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
              }
            );
          }
        }
      });
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }
);

//@route GET api/v1/auth
//@get the uesr by token
router.get('/', middleware, async (req, res) => {
  admin.GET['/api/v1/auth']++;
  try {
    const sql = `SELECT userId, name, email, date FROM user where userId = ${req.user.id}`;
    connection.query(sql, (err, user) => {
      if (err) {
        throw err;
      }
      res.json(user[0]);
    });
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router;
