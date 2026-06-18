const express = require('express');
const {
  getAllMedicines,
  getMedicineById,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  searchMedicine,
  addStock,
  reduceStock
} = require('../controllers/medicineController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllMedicines);
router.get('/search', searchMedicine);
router.get('/:id', getMedicineById);
router.post('/', verifyToken, addMedicine);
router.put('/:id', verifyToken, updateMedicine);
router.delete('/:id', verifyToken, deleteMedicine);
router.post('/:id/add-stock', verifyToken, addStock);
router.post('/:id/reduce-stock', verifyToken, reduceStock);

module.exports = router;
