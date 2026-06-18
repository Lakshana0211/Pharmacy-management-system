import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaClock } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const currentTime = new Date().toLocaleTimeString();

  return (
    <header className="bg-white border-b border-gray-200 p-6 fixed top-0 right-0 left-64 z-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome to Pharmacy Management System
          </h2>
          <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
            <FaClock /> {currentTime}
          </div>
        </div>
        <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg">
          <FaUser className="text-blue-600" />
          <span className="font-semibold text-gray-800">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
