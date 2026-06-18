const User = require('../models/User');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const result = User.verifyToken(token);

  if (!result.valid) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = result.data;
  next();
};

module.exports = { verifyToken };
