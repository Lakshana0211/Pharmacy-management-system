const Bill = require('../models/Bill');
const { db } = require('../database/db');

const createBill = async (req, res) => {
  try {
    const { items, discountPercent } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Bill must contain at least one item' });
    }

    const bill = new Bill();

    for (const item of items) {
      const result = await bill.addItem(item.medicineId, item.quantity, item.price);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
    }

    const billResult = await bill.processBill(discountPercent || 0);

    if (!billResult.success) {
      return res.status(400).json({ error: billResult.error });
    }

    res.status(201).json(billResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllBills = async (req, res) => {
  try {
    const bills = await db.allAsync(
      `SELECT s.id, s.total, s.createdAt, COUNT(si.id) as itemCount
       FROM sales s
       LEFT JOIN saleItems si ON s.id = si.saleId
       GROUP BY s.id
       ORDER BY s.createdAt DESC`,
      []
    );

    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBillById = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await db.getAsync(
      'SELECT * FROM sales WHERE id = ?',
      [id]
    );

    if (!sale) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    const items = await db.allAsync(
      `SELECT si.*, m.name FROM saleItems si
       JOIN medicines m ON si.medicineId = m.id
       WHERE si.saleId = ?`,
      [id]
    );

    res.json({
      ...sale,
      items
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchBills = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return getAllBills(req, res);
    }

    const bills = await db.allAsync(
      `SELECT s.id, s.total, s.createdAt, COUNT(si.id) as itemCount
       FROM sales s
       LEFT JOIN saleItems si ON s.id = si.saleId
       WHERE s.id LIKE ? OR s.createdAt LIKE ?
       GROUP BY s.id
       ORDER BY s.createdAt DESC`,
      [`%${q}%`, `%${q}%`]
    );

    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBill,
  getAllBills,
  getBillById,
  searchBills
};
