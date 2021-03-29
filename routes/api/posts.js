const express = require('express');
const router = express.Router();
const middleware = require('../../middleware/middleware');
const { check, validationResult } = require('express-validator');
const connection = require('../../config/db');

//@route POST api/posts
//formData: text, title, image
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

//@route GET api/posts
//@desc return all the posts
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

//@route GET api/posts/:id
//@desc get a post by its id
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

//@route DELETE api/posts/:id
//@desc delete a post by its id and all the comments that belong to the post
//only the owner of the post can delet it
router.delete('/:id', middleware, (req, res) => {
  try {
    //check if the user is the owner of the post
    let sql = `SELECT * FROM post where postId=${req.params.id} AND userId =${req.user.id}`;
    connection.query(sql, (err, post) => {
      if (err) {
        console.log(err);
        throw err;
      }
      //delete the comments
      sql = `DELETE FROM comment where postId=${req.params.id}`;
      connection.query(sql, (error, comments) => {
        if (error) {
          console.log(error);
          throw error;
        }
        //delete the post
        sql = `DELETE FROM post where postId = ${req.params.id} AND userId = ${req.user.id}`;
        connection.query(sql, (error2, post) => {
          if (error2) {
            console.log(error2);
            throw error2;
          }
          res.json(post);
        });
      });
    });
  } catch (error) {
    res.status(500).send('server error');
  }
});

//@route PUT api/posts/:id
//@desc update a post by its id and only the owner of the post can update it
//formData: text, title, image
router.put('/:id', middleware, (req, res) => {
  try {
    const { text, title, image } = req.body;
    const sql = `UPDATE post SET text = '${text}', title='${title}' WHERE postId=${req.params.id} AND userId=${req.user.id}`;
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
