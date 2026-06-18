const express = require('express');
const { getAlerts } = require('../controllers/alertController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, getAlerts);

module.exports = router;
