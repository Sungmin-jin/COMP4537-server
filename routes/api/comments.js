const express = require("express");
const router = express.Router();
const middleware = require("../../middleware/middleware");
const { check, validationResult } = require("express-validator");

const Comment = require("../../src/models/Comment");
const User = require("../../src/models/User");
const Post = require("../../src/models/Post");
const serverError = require("../../util/serverError");
const sequelize = require("../../src/database/connection");

//@route POST api/v1/comments
//add the comment to the certain post
//formData: text, postId
router.post(
  "/",
  [middleware, [check("text", "text is required")]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { text, postId, date } = req.body;

      const sql = `INSERT INTO comment (commentText, postId, userId, commentDate) VALUES ('${text}', ${postId}, ${req.user.id}, '${date}')`;
      const comment = await sequelize.query(sql);

      res.json({ commentId: comment[0] });
    } catch (error) {
      console.log(error);
      serverError(res);
    }
  }
);

//@route GET api/v1/comments/:id
//@desc get all the comments that belong to the certain posts
router.get("/:id", middleware, async (req, res) => {
  try {
    const sql = `SELECT * FROM comment JOIN user on user.userId = comment.userId WHERE postId = ${req.params.id}  ORDER BY commentDate desc`;
    let comments = await sequelize.query(sql);
    comments = comments[0];
    for (let comment of comments) {
      delete comment.password;
    }

    res.json(comments);
  } catch (error) {
    console.log(error);
    serverError(res);
  }
});

//@route PUT api/v1/comments/:id
//@desc update a comment by its id and only the owner of the comment can update the comment
router.put(
  "/",
  [middleware, [check("text", "text is required")]],
  async (req, res) => {
    try {
      const { text, id } = req.body;
      const comment = await Comment.findByPk(id);
      if (!comment) {
        return res.status(404).json({ errors: [{ msg: "comment not found" }] });
      }

      if (comment.userId !== req.user.id) {
        return res.status(403).json({ errors: [{ msg: "forbidden request" }] });
      }

      const updatedComment = await Comment.update(
        {
          commentText: text,
        },
        { where: { commentId: id } }
      );

      res.json(updatedComment);
    } catch (error) {
      console.log(error);
      serverError(res);
    }
  }
);

//@route DELETE api/v1/comments/:id
//@desc delete the comment by its id and only the ownser of the comment can delete
router.delete("/:id", middleware, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ errors: [{ msg: "post not found" }] });
    }
    if (comment.userId != req.user.id) {
      return res.status(403).json({ errors: [{ msg: "forbidden request" }] });
    }

    Comment.destroy({
      where: {
        commentId: req.params.id,
      },
    });

    res.json({ msg: "comment deleted" });
  } catch (error) {
    console.log(error);
    serverError(res);
  }
});

module.exports = router;
