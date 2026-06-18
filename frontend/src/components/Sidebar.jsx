import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBox, FaReceipt, FaExclamationTriangle, FaHistory, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ onLogout }) => {
  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: FaHome },
    { label: 'Medicines', path: '/medicines', icon: FaBox },
    { label: 'Billing', path: '/billing', icon: FaReceipt },
    { label: 'Alerts', path: '/alerts', icon: FaExclamationTriangle },
    { label: 'Sales History', path: '/sales-history', icon: FaHistory },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-blue-500">
        <h1 className="text-2xl font-bold">Pharmacy</h1>
        <p className="text-blue-200 text-sm">Management System</p>
      </div>

      {/* Menu Items */}
      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-4 px-6 py-4 hover:bg-blue-700 transition duration-200 border-l-4 border-transparent hover:border-white"
            >
              <Icon className="text-xl" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={onLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-200"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
