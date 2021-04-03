const express = require("express");
const router = express.Router();
const middleware = require("../../middleware/middleware");
const { check, validationResult } = require("express-validator");
const connection = require("../../config/db");
const admin = require("../../admin.json");

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
    ],
  ],
  (req, res) => {
    admin.POST["/api/v1/posts"]++;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array() });
    }
    try {
      const { text, title, price } = req.body;
      // const { image } = req.files.pic;
      console.log(req.files);
      const image = null;
      const sql = `INSERT INTO post (text, title, userId, price ${
        image ? ",image" : ""
      })
        VALUES ('${text}', '${title}', ${req.user.id}, ${price} ${
        image ? ",'" + data + "'" : ""
      })`;
      connection.query(sql, (err, result) => {
        if (err) {
          res.status(500).send("server error");
          console.log(err);
        }
        const insertId = result.insertId;
        res.json({ insertId });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  }
);

// router.post('/image/:id', (req, res) => {
//   try {
//     // console.log(req.files);
//     // console.log(req.body.image);
//     // const blob = new Blob(req.files.image.data);
//     const sql = `INSERT INTO image (postId, img) VALUES (?, ?)`;

//     connection.query(
//       sql,
//       [req.params.id, req.files.image.data],
//       (err, result) => {
//         if (err) {
//           console.log(err);
//           throw err;
//         }
//         res.json(result);
//       }
//     );
//     res.send('s');
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.get('/image', (req, res) => {
//   try {
//     const sql = `SELECT * FROM image`;
//     connection.query(sql, (err, result) => {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       console.log(result[0]);
//       // res.json(result[0]);
//       // res.sendFile(result[0].img);
//       const blob = new Blob([result[0].img]);
//       res.writeHead(200, { 'Content-Type': blob.type });
//       blob.stream().pipe(res);
//     });
//   } catch (error) {}
// });

//@route GET api/v1/posts
//@desc return all the posts
router.get("/", middleware, (req, res) => {
  admin.GET["/api/v1/posts"]++;
  try {
    const sql = "SELECT * FROM post ORDER BY date desc";
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      }
      res.json(result);
    });
  } catch (error) {
    res.status(500).send("server error");
  }
});

//@route GET api/v1/posts/:id
//@desc get a post by its id
router.get("/:id", middleware, (req, res) => {
  admin.GET["/api/v1/posts/:id"]++;
  try {
    const sql = `SELECT * FROM post where postId =${req.params.id}`;
    // const sql = `SELECT * FROM post p LEFT JOIN comment c ON p.postId = c.postId WHERE p.postId=${req.params.id}
    // UNION SELECT c.commentText, c.commentId, c.userId AS commentUserId, c.commentDate FROM post p RIGHT JOIN comment c ON p.postId = c.postId WHERE p.postId=${req.params.id}`;
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      }
      res.json(result[0]);
    });
  } catch (error) {
    res.status(500).send("server error");
  }
});

//@route DELETE api/v1/posts/:id
//@desc delete a post by its id and all the comments that belong to the post
//only the owner of the post can delet it
router.delete("/:id", middleware, (req, res) => {
  admin.DELETE["/api/v1/posts/:id"]++;
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
    res.status(500).send("server error");
  }
});

//@route PUT api/v1/posts/:id
//@desc update a post by its id and only the owner of the post can update it
//formData: text, title, image
router.put("/:id", middleware, (req, res) => {
  admin.PUT["/api/v1/posts/:id"]++;
  try {
    const { text, title, price } = req.body;
    const sql = `UPDATE post SET text = '${text}', title='${title}', price='${price}' WHERE postId=${req.params.id} AND userId=${req.user.id}`;
    connection.query(sql, (err, result) => {
      console.log(sql);
      if (err) {
        console.log(err);
        throw err;
      }
      res.json(result);
    });
  } catch (error) {
    res.status(500).send("server error");
  }
});

module.exports = router;
