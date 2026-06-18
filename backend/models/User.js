const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../database/db');

class User {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password; // Should be hashed
  }

  // Login method - validates user credentials
  async login(username, password) {
    try {
      // Fetch user from database
      const user = await db.getAsync(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (!user) {
        throw new Error('User not found');
      }

      // Compare passwords
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || 'pharmacy_system_secret_key_2024',
        { expiresIn: '24h' }
      );

      return {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'pharmacy_system_secret_key_2024'
      );
      return {
        valid: true,
        data: decoded
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }
}

module.exports = User;
