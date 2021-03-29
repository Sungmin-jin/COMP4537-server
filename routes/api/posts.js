const express = require('express');
const router = express.Router();
const middleware = require('../../middleware/middleware');
const { check, validationResult } = require('express-validator');
const connection = require('../../config/db');
//@route GET api/posts
router.post(
  '/',
  [
    middleware,
    [
      check('text', 'Text is required').not().isEmpty(),
      check('title', 'Title is required').not().isEmpty(),
    ],
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array() });
    }
    try {
      const { text, title } = req.body;
      // const { image } = req.files.pic;
      console.log(req.files);
      const image = null;
      const sql = `INSERT INTO post (text, title, userId ${
        image ? ',image' : ''
      })
        VALUES ('${text}', '${title}', ${req.user.id} ${
        image ? ",'" + data + "'" : ''
      })`;
      connection.query(sql, (err, result) => {
        if (err) {
          res.status(500).send('server error');
          console.log(err);
        }
        res.json(result);
      });
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/', middleware, (req, res) => {
  try {
    const sql = 'SELECT * FROM post ORDER BY date desc';
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

router.get('/:id', middleware, (req, res) => {
  try {
    const sql = `SELECT * FROM post where postId =${req.params.id}`;
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      }
      res.json(result[0]);
    });
  } catch (error) {
    res.status(500).send('server error');
  }
});

router.delete('/:id', middleware, (req, res) => {
  try {
    const sql = `DELETE FROM post where postId = ${req.params.id}`;
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
    const { text, title, image } = req.body;
    const sql = `UPDATE post SET text = '${text}', title='${title}' WHERE postId=${req.params.id}`;
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
