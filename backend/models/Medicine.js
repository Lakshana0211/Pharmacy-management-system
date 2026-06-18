const { db } = require('../database/db');

class Medicine {
  constructor(id, name, category, quantity, price, expiryDate) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.quantity = quantity;
    this.price = price;
    this.expiryDate = expiryDate;
  }

  // Get stock status
  getStatus() {
    const today = new Date();
    const expiry = new Date(this.expiryDate);

    if (expiry < today) {
      return 'Expired';
    }
    if (this.quantity === 0) {
      return 'Out of Stock';
    }
    if (this.quantity < 10) {
      return 'Low Stock';
    }
    return 'In Stock';
  }

  // Add stock to medicine
  async addStock(quantity) {
    try {
      if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      const newQuantity = this.quantity + quantity;

      await db.runAsync(
        'UPDATE medicines SET quantity = ? WHERE id = ?',
        [newQuantity, this.id]
      );

      this.quantity = newQuantity;

      return {
        success: true,
        message: `Added ${quantity} units. New stock: ${newQuantity}`,
        newQuantity
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Reduce stock from medicine
  async reduceStock(quantity) {
    try {
      if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      if (this.quantity < quantity) {
        throw new Error(`Insufficient stock. Available: ${this.quantity}`);
      }

      const newQuantity = this.quantity - quantity;

      await db.runAsync(
        'UPDATE medicines SET quantity = ? WHERE id = ?',
        [newQuantity, this.id]
      );

      this.quantity = newQuantity;

      return {
        success: true,
        message: `Reduced ${quantity} units. Remaining stock: ${newQuantity}`,
        newQuantity
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check if medicine is expired
  isExpired() {
    const today = new Date();
    const expiry = new Date(this.expiryDate);
    return expiry < today;
  }

  // Check if stock is low
  isLowStock() {
    return this.quantity < 10 && this.quantity > 0;
  }
}

module.exports = Medicine;
