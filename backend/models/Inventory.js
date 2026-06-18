const { db } = require('../database/db');
const Medicine = require('./Medicine');

class Inventory {
  constructor() {
    this.medicines = [];
  }

  // Add new medicine to inventory
  async addMedicine(name, category, quantity, price, expiryDate) {
    try {
      if (!name || !category || quantity < 0 || price < 0 || !expiryDate) {
        throw new Error('Invalid medicine data');
      }

      const result = await db.runAsync(
        'INSERT INTO medicines (name, category, quantity, price, expiryDate) VALUES (?, ?, ?, ?, ?)',
        [name, category, quantity, price, expiryDate]
      );

      const medicine = new Medicine(
        result.lastID,
        name,
        category,
        quantity,
        price,
        expiryDate
      );

      return {
        success: true,
        message: 'Medicine added successfully',
        medicine
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update medicine details
  async updateMedicine(id, name, category, quantity, price, expiryDate) {
    try {
      if (!id || !name || !category || quantity < 0 || price < 0 || !expiryDate) {
        throw new Error('Invalid medicine data');
      }

      await db.runAsync(
        'UPDATE medicines SET name = ?, category = ?, quantity = ?, price = ?, expiryDate = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [name, category, quantity, price, expiryDate, id]
      );

      const medicine = new Medicine(id, name, category, quantity, price, expiryDate);

      return {
        success: true,
        message: 'Medicine updated successfully',
        medicine
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete medicine from inventory
  async deleteMedicine(id) {
    try {
      if (!id) {
        throw new Error('Medicine ID is required');
      }

      const result = await db.runAsync(
        'DELETE FROM medicines WHERE id = ?',
        [id]
      );

      if (result.changes === 0) {
        throw new Error('Medicine not found');
      }

      return {
        success: true,
        message: 'Medicine deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search medicines by name or category
  async searchMedicine(query) {
    try {
      if (!query) {
        // Return all medicines if no query
        return await this.getAllMedicines();
      }

      const searchTerm = `%${query}%`;
      const medicines = await db.allAsync(
        'SELECT * FROM medicines WHERE name LIKE ? OR category LIKE ? ORDER BY name',
        [searchTerm, searchTerm]
      );

      return medicines || [];
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  // Get all medicines
  async getAllMedicines() {
    try {
      const medicines = await db.allAsync(
        'SELECT * FROM medicines ORDER BY name',
        []
      );
      return medicines || [];
    } catch (error) {
      console.error('Error fetching medicines:', error);
      return [];
    }
  }

  // Get medicine by ID
  async getMedicineById(id) {
    try {
      const medicine = await db.getAsync(
        'SELECT * FROM medicines WHERE id = ?',
        [id]
      );
      return medicine || null;
    } catch (error) {
      console.error('Error fetching medicine:', error);
      return null;
    }
  }
}

module.exports = Inventory;
