import React, { useEffect, useState } from 'react';
import { FaChartBar, FaBox, FaExclamationTriangle, FaDollarSign, FaTags, FaHistory } from 'react-icons/fa';
import { dashboardAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const cards = [
    {
      title: 'Total Medicines',
      value: stats?.totalMedicines || 0,
      icon: FaBox,
      color: 'bg-blue-500',
    },
    {
      title: 'Low Stock',
      value: stats?.lowStockMedicines || 0,
      icon: FaExclamationTriangle,
      color: 'bg-yellow-500',
    },
    {
      title: 'Expired Medicines',
      value: stats?.expiredMedicines || 0,
      icon: FaExclamationTriangle,
      color: 'bg-red-500',
    },
    {
      title: "Today's Sales",
      value: stats?.todaysSales || 0,
      icon: FaHistory,
      color: 'bg-green-500',
    },
    {
      title: 'Total Categories',
      value: stats?.totalCategories || 0,
      icon: FaTags,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: FaDollarSign,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-4 rounded-lg`}>
                  <Icon className="text-white text-2xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.monthlySales || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#0066cc" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {stats?.recentActivities?.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Snapshot */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Inventory Snapshot</h2>
        <table>
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats?.inventorySnapshot?.map((medicine) => (
              <tr key={medicine.id}>
                <td className="font-medium">{medicine.name}</td>
                <td>{medicine.quantity}</td>
                <td>
                  <span
                    className={`badge ${
                      medicine.status === 'In Stock'
                        ? 'badge-success'
                        : medicine.status === 'Low Stock'
                        ? 'badge-warning'
                        : 'badge-danger'
                    }`}
                  >
                    {medicine.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
