const express = require('express');
const { getStats } = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', verifyToken, getStats);

module.exports = router;
