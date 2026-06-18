const { db } = require('../database/db');

const getStats = async (req, res) => {
  try {
    // Total medicines
    const totalMedicines = await db.getAsync(
      'SELECT COUNT(*) as count FROM medicines',
      []
    );

    // Low stock medicines
    const lowStockMedicines = await db.getAsync(
      'SELECT COUNT(*) as count FROM medicines WHERE quantity > 0 AND quantity < 10',
      []
    );

    // Expired medicines
    const expiredMedicines = await db.getAsync(
      'SELECT COUNT(*) as count FROM medicines WHERE expiryDate < date("now")',
      []
    );

    // Today's sales
    const todaysSales = await db.getAsync(
      'SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as amount FROM sales WHERE DATE(createdAt) = DATE("now")',
      []
    );

    // Total categories
    const totalCategories = await db.getAsync(
      'SELECT COUNT(DISTINCT category) as count FROM medicines',
      []
    );

    // Total revenue
    const totalRevenue = await db.getAsync(
      'SELECT COALESCE(SUM(total), 0) as total FROM sales',
      []
    );

    // Monthly sales
    const monthlySales = await db.allAsync(
      `SELECT strftime('%m', createdAt) as month, SUM(total) as total
       FROM sales
       WHERE strftime('%Y', createdAt) = strftime('%Y', 'now')
       GROUP BY month
       ORDER BY month`,
      []
    );

    // Recent activities
    const recentActivities = await db.allAsync(
      `SELECT 
        'Sale' as type,
        'Sold medicines' as description,
        createdAt as timestamp
      FROM sales
      ORDER BY createdAt DESC
      LIMIT 5`,
      []
    );

    // Inventory snapshot
    const inventorySnapshot = await db.allAsync(
      `SELECT id, name, quantity, 
        CASE 
          WHEN expiryDate < date('now') THEN 'Expired'
          WHEN quantity = 0 THEN 'Out of Stock'
          WHEN quantity < 10 THEN 'Low Stock'
          ELSE 'In Stock'
        END as status
      FROM medicines
      ORDER BY quantity ASC
      LIMIT 10`,
      []
    );

    res.json({
      totalMedicines: totalMedicines.count,
      lowStockMedicines: lowStockMedicines.count,
      expiredMedicines: expiredMedicines.count,
      todaysSales: todaysSales.count,
      todaysAmount: todaysSales.amount,
      totalCategories: totalCategories.count,
      totalRevenue: totalRevenue.total,
      monthlySales,
      recentActivities,
      inventorySnapshot
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getStats };
