import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import Billing from './pages/Billing';
import Alerts from './pages/Alerts';
import SalesHistory from './pages/SalesHistory';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const ProtectedLayout = ({ logout }) => {
  return (
    <div className="flex">
      <Sidebar onLogout={logout} />
      <div className="flex-1 ml-64">
        <Header />
        <main className="mt-24 p-8">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/sales-history" element={<SalesHistory />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  const { isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <ProtectedLayout logout={logout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
