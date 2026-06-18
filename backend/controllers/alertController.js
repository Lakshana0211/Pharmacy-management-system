const { db } = require('../database/db');

const getAlerts = async (req, res) => {
  try {
    // Low stock medicines
    const lowStockAlerts = await db.allAsync(
      `SELECT id, name, category, quantity, price, expiryDate, 'Low Stock' as alertType
       FROM medicines
       WHERE quantity > 0 AND quantity < 10
       ORDER BY quantity ASC`,
      []
    );

    // Expired medicines
    const expiredAlerts = await db.allAsync(
      `SELECT id, name, category, quantity, price, expiryDate, 'Expired' as alertType
       FROM medicines
       WHERE expiryDate < date('now')
       ORDER BY expiryDate ASC`,
      []
    );

    // Medicines expiring within 30 days
    const expiringAlerts = await db.allAsync(
      `SELECT id, name, category, quantity, price, expiryDate, 'Expiring Soon' as alertType
       FROM medicines
       WHERE expiryDate BETWEEN date('now') AND date('now', '+30 days')
       AND expiryDate >= date('now')
       ORDER BY expiryDate ASC`,
      []
    );

    const alerts = [
      ...lowStockAlerts,
      ...expiredAlerts,
      ...expiringAlerts
    ];

    res.json({
      total: alerts.length,
      lowStock: lowStockAlerts.length,
      expired: expiredAlerts.length,
      expiringsoon: expiringAlerts.length,
      alerts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAlerts };
