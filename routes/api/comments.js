const express = require('express');
const router = express.Router();
const middleware = require('../../middleware/middleware');
const { check, validationResult } = require('express-validator');
const connection = require('../../config/db');

router.post(
  '/',
  [middleware, [check('text', 'text is required')]],
  (req, res) => {
    const { text, postId } = req.body;
    try {
      const sql = `INSERT INTO comment (text, postId, userId) VALUES ('${text}', ${postId}, ${req.user.id})`;
      connection.query(sql, (err, result) => {
        if (err) {
          console.log(err);
          throw err;
        }
        res.json(result);
      });
    } catch (error) {
      res.status(500).send('server error');
    }
  }
);

router.get('/:id', middleware, (req, res) => {
  try {
    const sql = `SELECT * FROM comment WHERE postId = ${req.params.id}`;
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      }
      res.json(result);
    });
  } catch (error) {
    res.status(500).send('server error');
  }
});

router.put('/:id', middleware, (req, res) => {
  try {
    const { text } = req.body;
    const sql = `UPDATE comment SET text='${text}' WHERE commentId=${req.params.id} AND userId=${req.user.id}`;
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      }
      res.json(result);
    });
  } catch (error) {
    res.status(500).send('server error');
  }
});

module.exports = router;
