const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../../src/models/User");
const serverError = require("../../util/serverError");

//Register
//route POST api/v1/user
//required form data: name, email, password
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please inculde a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array() });
    }

    const { name, email, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ where: { email: email } }).catch(
      (err) => {
        console.log(err);
        return serverError(res);
      }
    );
    console.log("user", user);
    if (user) {
      return res.status(400).json({ msg: [{ msg: "User already exists" }] });
    }
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      name,
      password: bcryptPassword,
    }).catch((err) => {
      console.log(err);
      return serverError(res);
    });
    const payload = {
      user: {
        id: newUser.userId,
      },
    };
    //expires time 1hour
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          throw err;
        }
        res.json({ token });
      }
    );
  }
);

module.exports = router;
