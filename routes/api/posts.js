const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

//@route GET api/posts
router.get('/', (req, res) => {
  res.send('User route');
});

module.exports = router;
