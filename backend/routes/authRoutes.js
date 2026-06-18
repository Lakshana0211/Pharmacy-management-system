const express = require('express');
const { login, verifyToken } = require('../controllers/authController');
const { verifyToken: verifyTokenMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/verify', verifyTokenMiddleware, verifyToken);

module.exports = router;
