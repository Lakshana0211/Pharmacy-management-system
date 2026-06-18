# Enhanced Pharmacy Management System

A modern, full-stack pharmacy management system built with React, Express, and SQLite. Perfect for a college OOP capstone project.

## 🎯 Features

- ✅ JWT-based Admin Authentication
- ✅ Medicine Management (CRUD operations)
- ✅ Billing System with Cart
- ✅ Inventory Alerts
- ✅ Sales History & Invoice Generation
- ✅ Dashboard with Analytics
- ✅ OOP Implementation with Classes
- ✅ Responsive Modern UI

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router
- Tailwind CSS
- Axios

**Backend:**
- Node.js
- Express.js
- SQLite3
- JWT
- bcryptjs

## 📁 Project Structure

```
pharmacy-management-system/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Express server
│   ├── routes/              # API routes
│   ├── models/              # OOP classes
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Auth middleware
│   ├── database/            # DB setup
│   ├── server.js
│   └── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

**Seed Database:**
Database is automatically seeded with sample data on first run.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🔐 Default Credentials

```
Username: admin
Password: admin123
```

## 📊 Database Tables

### Users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT
);
```

### Medicines
```sql
CREATE TABLE medicines (
  id INTEGER PRIMARY KEY,
  name TEXT,
  category TEXT,
  quantity INTEGER,
  price REAL,
  expiryDate TEXT
);
```

### Sales
```sql
CREATE TABLE sales (
  id INTEGER PRIMARY KEY,
  total REAL,
  createdAt TIMESTAMP
);
```

### SaleItems
```sql
CREATE TABLE saleItems (
  id INTEGER PRIMARY KEY,
  saleId INTEGER,
  medicineId INTEGER,
  quantity INTEGER,
  price REAL,
  FOREIGN KEY (saleId) REFERENCES sales(id),
  FOREIGN KEY (medicineId) REFERENCES medicines(id)
);
```

## 🏗️ OOP Architecture

### Classes Implemented

**User** - Authentication and user management
- `login()` - Authenticate user with JWT

**Medicine** - Medicine operations
- `addStock()` - Increase stock quantity
- `reduceStock()` - Decrease stock quantity

**Inventory** - Inventory management
- `addMedicine()` - Add new medicine
- `updateMedicine()` - Update medicine details
- `deleteMedicine()` - Remove medicine
- `searchMedicine()` - Search by name/category

**Bill** - Billing operations
- `addItem()` - Add item to cart
- `calculateTotal()` - Calculate bill amount

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify JWT token

### Medicines
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/:id` - Get medicine by ID
- `POST /api/medicines` - Create medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine
- `GET /api/medicines/search?q=name` - Search medicines

### Billing
- `POST /api/bills` - Create new bill
- `GET /api/bills` - Get all bills
- `GET /api/bills/:id` - Get bill details

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Alerts
- `GET /api/alerts` - Get low stock & expired medicines

## 📱 Pages

1. **Login** - Secure admin authentication
2. **Dashboard** - Overview with stats and charts
3. **Medicines** - Manage medicine inventory
4. **Billing** - Create invoices and manage sales
5. **Alerts** - Monitor stock and expiry status
6. **Sales History** - View all generated invoices

## 🎨 UI Features

- Clean healthcare-inspired design
- Blue and white color palette
- Responsive sidebar navigation
- Professional cards and shadows
- Status badges for medicine conditions
- Real-time search and filters
- Chart visualization
- Modal forms

## 👨‍💻 OOP Concepts Demonstrated

- **Encapsulation** - Private methods and properties in classes
- **Inheritance** - Base classes for common functionality
- **Polymorphism** - Method overriding and abstract concepts
- **Abstraction** - Complex logic hidden behind simple interfaces

## 🧪 Testing

### Sample Data Seeded
- 20 medicines across 5 categories
- 1 admin user
- Sample sales history

## 📝 How to Use

1. **Login** with provided credentials
2. **Add Medicines** from Medicines page
3. **Create Bills** from Billing page by selecting medicines
4. **Monitor Alerts** for low stock and expiry
5. **View Sales History** for all transactions

## 🐛 Troubleshooting

**Port Already in Use**
```bash
# Change port in backend .env or server.js
```

**Database Issues**
```bash
# Delete database.db and restart server to reseed
```

**CORS Issues**
- Frontend and backend must be on different ports
- CORS is enabled in Express configuration

## 📚 Learning Outcomes

This project demonstrates:
- Full-stack development
- REST API design
- Database design and SQL
- JWT authentication
- Component-based architecture
- OOP principles in JavaScript
- State management
- Form handling
- Error handling

## 🎓 Perfect for Capstone Projects

- Clean, understandable code
- Well-organized structure
- Professional UI/UX
- Complete CRUD operations
- Authentication system
- Real-world scenario
- Easy to explain in viva

## 📄 License

MIT License - Feel free to use for educational purposes

## ✨ Future Enhancements

- User roles and permissions
- PDF invoice generation
- Email notifications
- Advanced analytics
- Batch operations
- API documentation with Swagger
- Unit tests with Jest

---

**Happy Coding! 🚀**

For questions or issues, refer to individual component documentation in the code.