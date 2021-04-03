const express = require('express');
const router = express.Router();
const middleware = require('../../middleware/middleware');
const { check, validationResult } = require('express-validator');
const connection = require('../../config/db');
const admin = require('../../admin.json');

//@route POST api/v1/comments
//add the comment to the certain post
//formData: text, postId
router.post(
  '/',
  [middleware, [check('text', 'text is required')]],
  (req, res) => {
    admin.POST['/api/v1/comments']++;
    const { text, postId } = req.body;
    try {
      const sql = `INSERT INTO comment (commentText, postId, userId) VALUES ('${text}', ${postId}, ${req.user.id})`;
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

//@route GET api/v1/comments/:id
//@desc get all the comments that belong to the certain posts
router.get('/:id', middleware, (req, res) => {
  admin.GET['/api/v1/comments/:id']++;
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

//@route PUT api/v1/comments/:id
//@desc update a comment by its id and only the owner of the comment can update the comment
router.put('/:id', middleware, (req, res) => {
  admin.PUT['/api/v1/comments/:id']++;
  try {
    const { text } = req.body;
    const sql = `UPDATE comment SET commentText='${text}' WHERE commentId=${req.params.id} AND userId=${req.user.id}`;
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

//@route DELETE api/v1/comments/:id
//@desc delete the comment by its id and only the ownser of the comment can delete
router.delete('/:id', middleware, (req, res) => {
  admin.DELETE['/api/v1/comments/:id']++;
  try {
    const sql = `DELETE FROM comment WHERE commentId=${req.params.id} AND userId=${req.user.id}`;
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
