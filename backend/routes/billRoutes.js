const express = require('express');
const {
  createBill,
  getAllBills,
  getBillById,
  searchBills
} = require('../controllers/billController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', verifyToken, createBill);
router.get('/', getAllBills);
router.get('/search', searchBills);
router.get('/:id', getBillById);

module.exports = router;
