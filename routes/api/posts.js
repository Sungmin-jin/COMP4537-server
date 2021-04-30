const express = require("express");
const router = express.Router();
const middleware = require("../../middleware/middleware");
const { check, validationResult } = require("express-validator");

const Post = require("../../src/models/Post");
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
      const { text, title, price, image } = req.body;
      const post = await Post.create({
        text,
        title,
        price,
        userId: req.user.id,
        img: image,
      });
      res.json(post);
    } catch (error) {
      console.log(error);
      serverError(res);
    }
    // try {
    //   const { text, title, price, image } = req.body;
    //   console.log(req.body);
    //   // const { image } = req.files.pic;
    //   console.log(req.files);
    //   const sql = `INSERT INTO post (text, title, userId, price ${
    //     image ? ",img" : ""
    //   })
    //     VALUES ('${text}', '${title}', ${req.user.id}, ${price} ${
    //     image ? ",'" + image + "'" : ""
    //   })`;
    //   connection.query(sql, (err, result) => {
    //     if (err) {
    //       res.status(500).send("server error");
    //       console.log(err);
    //     }
    //     const insertId = result.insertId;
    //     res.json({ insertId });
    //   });
    // } catch (error) {
    //   console.log(error);
    //   res.status(500).send("Server Error");
    // }
  }
);

//@route GET api/v1/posts
//@desc return all the posts
router.get("/", middleware, async (req, res) => {
  try {
    const posts = await Post.findAll({ order: [["postDate", "DESC"]] });
    res.json(posts);
    // const sql = "SELECT * FROM post ORDER BY postDate desc";
    // connection.query(sql, (err, result) => {
    //   if (err) {
    //     console.log(err);
    //     throw err;
    //   }
    //   res.json(result);
    // });
  } catch (error) {
    console.log(error);
    serverError(res);
    // res.status(500).send("server error");
  }
});

//@route GET api/v1/posts/user
//@desc return all the posts of user
router.get("/user", middleware, async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { userId: req.user.id },
      order: [["userId", "DESC"]],
    });
    res.json(posts);
    // const sql = `SELECT * FROM post WHERE userId = ${req.user.id} ORDER BY postDate desc`;
    // connection.query(sql, (err, result) => {
    //   if (err) {
    //     console.log(err);
    //     throw err;
    //   }
    //   res.json(result);
    // });
  } catch (error) {
    console.log(error);
    serverError(res);
    // res.status(500).send("server error");
  }
});

//@route GET api/v1/posts/:id
//@desc get a post by its id
router.get("/:id", middleware, async (req, res) => {
  try {
    // Post.belongsTo(User, {
    //   foreighKey: "id",
    //   targetKey: "userId",
    //   as: "user",
    // });
    // const post = await Post.findByPk(req.params.id);
    // res.json(post);

    const sql = `SELECT * FROM post LEFT JOIN user on user.userId = post.userId where postId =${req.params.id} UNION SELECT * FROM post RIGHT JOIN user on user.userId = post.userId`;
    let post = await sequelize.query(sql);
    post = post[0][0];
    delete post.password;
    res.json(post);

    // // const sql = `SELECT * FROM post p LEFT JOIN comment c ON p.postId = c.postId WHERE p.postId=${req.params.id}
    // // UNION SELECT c.commentText, c.commentId, c.userId AS commentUserId, c.commentDate FROM post p RIGHT JOIN comment c ON p.postId = c.postId WHERE p.postId=${req.params.id}`;
    // connection.query(sql, (err, result) => {
    //   if (err) {
    //     console.log(err);
    //     throw err;
    //   }
    //   res.json(result[0]);
    // });
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
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (post.userId !== req.user.id) {
      return res.status(403).json({ msg: "forbidden request" });
    }

    Post.destroy({
      where: {
        postId: req.params.id,
      },
    });

    res.json({ msg: "Post deleted" });

    // //check if the user is the owner of the post
    // let sql = `SELECT * FROM post where postId=${req.params.id} AND userId =${req.user.id}`;
    // connection.query(sql, (err, post) => {
    //   if (err) {
    //     console.log(err);
    //     throw err;
    //   }
    //   //delete the comments
    //   sql = `DELETE FROM comment where postId=${req.params.id}`;
    //   connection.query(sql, (error, comments) => {
    //     if (error) {
    //       console.log(error);
    //       throw error;
    //     }
    //     //delete the post
    //     sql = `DELETE FROM post where postId = ${req.params.id} AND userId = ${req.user.id}`;
    //     connection.query(sql, (error2, post) => {
    //       if (error2) {
    //         console.log(error2);
    //         throw error2;
    //       }
    //       res.json(post);
    //     });
    //   });
    // });
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
        return res.status(404).json({ msg: "post not found" });
      }
      if (post.userId !== req.user.id) {
        return res.status(403).json({ msg: "forbidden request" });
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

      // const sql = `UPDATE post SET isSold = ${
      //   isSold ? "true" : "false"
      // }, text = '${text}', title='${title}', price='${price}' ${
      //   image ? ", img = '" + image + "'" : ""
      // } WHERE postId=${req.params.id} AND userId=${req.user.id}`;
      // connection.query(sql, (err, result) => {
      //   if (err) {
      //     console.log(err);
      //     throw err;
      //   }
      //   res.json(result);
      // });
    } catch (error) {
      console.log(error);
      serverError(res);
    }
  }
);

module.exports = router;
