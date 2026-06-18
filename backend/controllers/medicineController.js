const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');
const { db } = require('../database/db');

const inventory = new Inventory();

const getAllMedicines = async (req, res) => {
  try {
    const medicines = await inventory.getAllMedicines();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await inventory.getMedicineById(id);

    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addMedicine = async (req, res) => {
  try {
    const { name, category, quantity, price, expiryDate } = req.body;

    const result = await inventory.addMedicine(
      name,
      category,
      quantity,
      price,
      expiryDate
    );

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, price, expiryDate } = req.body;

    const result = await inventory.updateMedicine(
      id,
      name,
      category,
      quantity,
      price,
      expiryDate
    );

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await inventory.deleteMedicine(id);

    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchMedicine = async (req, res) => {
  try {
    const { q } = req.query;
    const results = await inventory.searchMedicine(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const medicine = await inventory.getMedicineById(id);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    const medicineObj = new Medicine(
      medicine.id,
      medicine.name,
      medicine.category,
      medicine.quantity,
      medicine.price,
      medicine.expiryDate
    );

    const result = await medicineObj.addStock(quantity);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const reduceStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const medicine = await inventory.getMedicineById(id);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    const medicineObj = new Medicine(
      medicine.id,
      medicine.name,
      medicine.category,
      medicine.quantity,
      medicine.price,
      medicine.expiryDate
    );

    const result = await medicineObj.reduceStock(quantity);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMedicines,
  getMedicineById,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  searchMedicine,
  addStock,
  reduceStock
};
