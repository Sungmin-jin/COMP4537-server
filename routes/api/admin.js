const connection = require('../../config/db');
const express = require('express');
const router = express.Router();
const admin = require('../../admin.json');

router.get('/', (req, res) => {
  res.json(admin);
});

module.exports = router;
