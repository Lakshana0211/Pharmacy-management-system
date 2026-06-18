const { db } = require('../database/db');
const Medicine = require('./Medicine');

class Bill {
  constructor() {
    this.items = []; // Array of {medicineId, quantity, price}
    this.total = 0;
    this.itemCount = 0;
  }

  // Add item to bill
  async addItem(medicineId, quantity, price) {
    try {
      if (!medicineId || quantity <= 0 || price <= 0) {
        throw new Error('Invalid item data');
      }

      // Check if medicine exists and has sufficient stock
      const medicine = await db.getAsync(
        'SELECT * FROM medicines WHERE id = ?',
        [medicineId]
      );

      if (!medicine) {
        throw new Error('Medicine not found');
      }

      if (medicine.quantity < quantity) {
        throw new Error(`Insufficient stock. Available: ${medicine.quantity}`);
      }

      // Check expiry
      const expiry = new Date(medicine.expiryDate);
      if (expiry < new Date()) {
        throw new Error('Cannot sell expired medicine');
      }

      // Add item to bill
      const item = {
        medicineId,
        medicineName: medicine.name,
        quantity,
        price,
        subtotal: quantity * price
      };

      this.items.push(item);
      this.itemCount++;
      this.calculateTotal();

      return {
        success: true,
        message: 'Item added to bill',
        item
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Remove item from bill
  removeItem(index) {
    try {
      if (index < 0 || index >= this.items.length) {
        throw new Error('Invalid item index');
      }

      this.items.splice(index, 1);
      this.itemCount--;
      this.calculateTotal();

      return {
        success: true,
        message: 'Item removed from bill'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Calculate total bill amount
  calculateTotal() {
    this.total = this.items.reduce((sum, item) => sum + item.subtotal, 0);
    return this.total;
  }

  // Generate bill with discount (polymorphism example)
  generateBill(discountPercent = 0) {
    const discountAmount = (this.total * discountPercent) / 100;
    const finalTotal = this.total - discountAmount;

    return {
      items: this.items,
      subtotal: this.total,
      discount: discountAmount,
      discountPercent,
      total: finalTotal,
      itemCount: this.itemCount,
      timestamp: new Date()
    };
  }

  // Process bill and save to database
  async processBill(discountPercent = 0) {
    try {
      if (this.items.length === 0) {
        throw new Error('Bill is empty');
      }

      const billData = this.generateBill(discountPercent);

      // Save sale
      const saleResult = await db.runAsync(
        'INSERT INTO sales (total) VALUES (?)',
        [billData.total]
      );

      const saleId = saleResult.lastID;

      // Save sale items and reduce stock
      for (const item of this.items) {
        // Save sale item
        await db.runAsync(
          'INSERT INTO saleItems (saleId, medicineId, quantity, price) VALUES (?, ?, ?, ?)',
          [saleId, item.medicineId, item.quantity, item.price]
        );

        // Reduce medicine stock
        await db.runAsync(
          'UPDATE medicines SET quantity = quantity - ? WHERE id = ?',
          [item.quantity, item.medicineId]
        );
      }

      return {
        success: true,
        message: 'Bill processed successfully',
        invoiceId: saleId,
        billData
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = Bill;
