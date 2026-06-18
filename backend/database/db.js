const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../database.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('✓ SQLite database connected');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize database tables
const initializeDatabase = () => {
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create medicines table
  db.run(`
    CREATE TABLE IF NOT EXISTS medicines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      price REAL NOT NULL,
      expiryDate TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create sales table
  db.run(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total REAL NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create saleItems table
  db.run(`
    CREATE TABLE IF NOT EXISTS saleItems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      saleId INTEGER NOT NULL,
      medicineId INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (saleId) REFERENCES sales(id) ON DELETE CASCADE,
      FOREIGN KEY (medicineId) REFERENCES medicines(id)
    )
  `);

  // Seed admin user if not exists
  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  
  db.run(
    'INSERT OR IGNORE INTO users (id, username, password) VALUES (?, ?, ?)',
    [1, 'admin', hashedPassword],
    (err) => {
      if (err) {
        console.error('Error seeding admin user:', err);
      } else {
        console.log('✓ Admin user seeded');
      }
    }
  );

  // Seed medicines
  seedMedicines();
};

const seedMedicines = () => {
  const medicines = [
    { name: 'Aspirin', category: 'Analgesics', quantity: 50, price: 5.99, expiryDate: '2025-12-31' },
    { name: 'Ibuprofen', category: 'Analgesics', quantity: 30, price: 7.99, expiryDate: '2025-11-30' },
    { name: 'Paracetamol', category: 'Analgesics', quantity: 45, price: 4.99, expiryDate: '2026-01-15' },
    { name: 'Amoxicillin', category: 'Antibiotics', quantity: 20, price: 12.99, expiryDate: '2025-08-30' },
    { name: 'Cephalexin', category: 'Antibiotics', quantity: 15, price: 14.99, expiryDate: '2025-09-20' },
    { name: 'Omeprazole', category: 'Antacids', quantity: 40, price: 8.99, expiryDate: '2025-10-10' },
    { name: 'Ranitidine', category: 'Antacids', quantity: 35, price: 7.49, expiryDate: '2025-11-05' },
    { name: 'Metformin', category: 'Antidiabetic', quantity: 60, price: 10.99, expiryDate: '2026-02-28' },
    { name: 'Insulin', category: 'Antidiabetic', quantity: 10, price: 45.99, expiryDate: '2025-07-15' },
    { name: 'Atorvastatin', category: 'Cholesterol', quantity: 55, price: 11.99, expiryDate: '2026-03-10' },
    { name: 'Simvastatin', category: 'Cholesterol', quantity: 42, price: 10.49, expiryDate: '2025-12-20' },
    { name: 'Loratadine', category: 'Antihistamine', quantity: 38, price: 6.99, expiryDate: '2026-01-30' },
    { name: 'Cetirizine', category: 'Antihistamine', quantity: 50, price: 5.99, expiryDate: '2025-10-15' },
    { name: 'Salbutamol', category: 'Asthma', quantity: 25, price: 9.99, expiryDate: '2025-09-10' },
    { name: 'Fluticasone', category: 'Asthma', quantity: 18, price: 15.99, expiryDate: '2025-11-25' },
    { name: 'Lisinopril', category: 'Blood Pressure', quantity: 48, price: 9.49, expiryDate: '2026-02-15' },
    { name: 'Amlodipine', category: 'Blood Pressure', quantity: 52, price: 10.99, expiryDate: '2025-12-10' },
    { name: 'Doxycycline', category: 'Antibiotics', quantity: 22, price: 13.99, expiryDate: '2025-08-20' },
    { name: 'Vitamin D', category: 'Vitamins', quantity: 75, price: 4.49, expiryDate: '2026-05-30' },
    { name: 'Multivitamin', category: 'Vitamins', quantity: 65, price: 7.99, expiryDate: '2026-04-15' }
  ];

  medicines.forEach((medicine) => {
    db.run(
      'INSERT OR IGNORE INTO medicines (name, category, quantity, price, expiryDate) VALUES (?, ?, ?, ?, ?)',
      [medicine.name, medicine.category, medicine.quantity, medicine.price, medicine.expiryDate],
      (err) => {
        if (err) {
          console.error('Error seeding medicine:', err);
        }
      }
    );
  });

  console.log('✓ Sample medicines seeded');
};

// Helper function to run queries
db.allAsync = function(sql, params) {
  return new Promise((resolve, reject) => {
    this.all(sql, params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

db.getAsync = function(sql, params) {
  return new Promise((resolve, reject) => {
    this.get(sql, params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

db.runAsync = function(sql, params) {
  return new Promise((resolve, reject) => {
    this.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

module.exports = {
  db,
  initializeDatabase
};
