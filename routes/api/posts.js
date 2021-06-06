const express = require("express");
const router = express.Router();
const middleware = require("../../middleware/middleware");
const { check, validationResult } = require("express-validator");

const Post = require("../../src/models/Post");
const Comment = require("../../src/models/Comment");
const serverError = require("../../util/serverError");
const sequelize = require("../../src/database/connection");

//@route POST api/v1/posts
//formData: text, title, image
router.post(
  "/",
  [
    middleware,
    [
      check("text", "Text is required").not().isEmpty(),
      check("title", "Title is required").not().isEmpty(),
      check("price", "Price is require").not().isEmpty(),
      check("image", "Image is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array() });
    }
    try {
      const { text, title, price, image, date } = req.body;
      const post = await Post.create({
        text,
        title,
        price,
        userId: req.user.id,
        img: image,
        postDate: date,
      });
      res.json(post);
    } catch (error) {
      console.log(error);
      serverError(res);
    }
  }
);

//@route GET api/v1/posts
//@desc return all the posts
router.get("/", middleware, async (req, res) => {
  try {
    const posts = await Post.findAll({ order: [["postDate", "DESC"]] });
    res.json(posts);
  } catch (error) {
    console.log(error);
    serverError(res);
  }
});

//@route GET api/v1/posts/user
//@desc return all the posts of user
router.get("/user", middleware, async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { userId: req.user.id },
      order: [["postDate", "DESC"]],
    });
    res.json(posts);
  } catch (error) {
    console.log(error);
    serverError(res);
  }
});

//@route GET api/v1/posts/:id
//@desc get a post by its id
router.get("/:id", middleware, async (req, res) => {
  try {
    const sql = `SELECT * FROM post LEFT JOIN user on user.userId = post.userId where postId =${req.params.id} UNION SELECT * FROM post RIGHT JOIN user on user.userId = post.userId`;
    let post = await sequelize.query(sql);
    post = post[0][0];
    delete post.password;
    res.json(post);
  } catch (error) {
    console.log(error);
    serverError(res);
  }
});

//@route DELETE api/v1/posts/:id
//@desc delete a post by its id and all the comments that belong to the post
//only the owner of the post can delet it
router.delete("/:id", middleware, async (req, res) => {
  try {
    console.log(req.params.id);
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ errors: [{ msg: "Post not found" }] });
    }
    if (post.userId !== req.user.id) {
      return res.status(403).json({ errors: [{ msg: "forbidden request" }] });
    }
    await Comment.destroy({
      where: {
        postId: req.params.id,
      },
    });

    await Post.destroy({
      where: {
        postId: req.params.id,
      },
    });

    res.json({ msg: "Post deleted" });
  } catch (error) {
    console.log(error);
    serverError(res);
  }
});

//@route PUT api/v1/posts/:id
//@desc update a post by its id and only the owner of the post can update it
//formData: text, title, image
router.put(
  "/:id",
  [
    middleware,
    [
      check("text", "Text is required").not().isEmpty(),
      check("title", "Title is required").not().isEmpty(),
      check("price", "Price is require").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const { text, title, price, image, isSold } = req.body;

      const post = await Post.findByPk(req.params.id);
      if (!post) {
        return res.status(404).json({ errors: [{ msg: "post not found" }] });
      }
      if (post.userId !== req.user.id) {
        return res.status(403).json({ errors: [{ msg: "forbidden request" }] });
      }

      const updatedPost = await Post.update(
        {
          text,
          title,
          price,
          img: image,
          isSold,
        },
        { where: { postId: req.params.id } }
      );

      res.json(updatedPost);
    } catch (error) {
      console.log(error);
      serverError(res);
    }
  }
);

module.exports = router;
