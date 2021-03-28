const jwt = require('jsonwebtoken');
const config = require('config');

//check if user is authenticated or not
module.exports = function (req, res, next) {
  // get toke from header
  const token = req.header('x-auth-token');

  //check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token is recieved' });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};
