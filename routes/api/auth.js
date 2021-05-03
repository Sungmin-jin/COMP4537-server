const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const middleware = require("../../middleware/middleware");
const User = require("../../src/models/User");
const serverError = require("../../util/serverError");

//@route POST api/v1/auth
//@desc login user and return token
//formData: email, password
router.post(
  "/",
  [
    check("email", "Please inculde a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ msg: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return res.status(400).json({ msg: [{ msg: "Invalid credentials" }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: [{ msg: "Invalid credentials" }] });
      }

      const payload = {
        user: {
          id: user.userId,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error);
      serverError(res);
    }

    // try {
    //   //check user exists
    //   let sql = `SELECT * FROM user WHERE email = '${email}'`;
    //   connection.query(sql, async (error, user) => {
    //     if (error) {
    //       console.log(error);
    //       res.status(500).send("Server Error");
    //     }
    //     // user does not exist
    //     if (user.length === 0) {
    //       res.status(400).json({ msg: [{ msg: "Invalid credentials" }] });
    //     }
    //     // user exist
    //     else {
    //       const isMatch = await bcrypt.compare(password, user[0].password);
    //       if (!isMatch) {
    //         res.status(400).json({ msg: [{ msg: "Invalid credentials" }] });
    //       } else {
    //         const payload = {
    //           user: {
    //             id: user[0].userId,
    //           },
    //         };
    //         jwt.sign(
    //           payload,
    //           config.get("jwtSecret"),
    //           { expiresIn: 360000 },
    //           (err, token) => {
    //             if (err) throw err;
    //             res.json({ token });
    //           }
    //         );
    //       }
    //     }
    //   });
    // } catch (error) {
    //   res.status(500).send("Server Error");
    // }
  }
);

//@route GET api/v1/auth
//@get the uesr by token
router.get("/", middleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    serverError(res);
  }
});

module.exports = router;
