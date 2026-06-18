const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = new User(null, username, password);
    const result = await user.login(username, password);

    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyToken = (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
};

module.exports = { login, verifyToken };
