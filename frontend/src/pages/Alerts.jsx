import React, { useEffect, useState } from 'react';
import { alertAPI } from '../services/api';
import { FaExclamationTriangle, FaClock } from 'react-icons/fa';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await alertAPI.getAlerts();
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertColor = (alertType) => {
    switch (alertType) {
      case 'Low Stock':
        return 'badge-warning';
      case 'Expired':
        return 'badge-danger';
      case 'Expiring Soon':
        return 'badge-warning';
      default:
        return '';
    }
  };

  const getAlertIcon = (alertType) => {
    if (alertType === 'Expiring Soon') {
      return <FaClock className="text-yellow-500" />;
    }
    return <FaExclamationTriangle className="text-red-500" />;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Alerts</h1>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Alerts</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{alerts.total || 0}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <FaExclamationTriangle className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Low Stock</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{alerts.lowStock || 0}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <FaExclamationTriangle className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Expired/Expiring</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {(alerts.expired || 0) + (alerts.expiringsoon || 0)}
              </p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <FaExclamationTriangle className="text-red-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Alert Details</h2>
        {alerts.alerts && alerts.alerts.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No alerts</p>
        ) : (
          <div className="space-y-3">
            {alerts.alerts?.map((alert) => (
              <div key={alert.id} className="flex items-start p-4 bg-gray-50 rounded-lg border-l-4 border-yellow-500">
                <div className="mt-1 mr-4 text-xl">{getAlertIcon(alert.alertType)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{alert.name}</h3>
                    <span className={`badge ${getAlertColor(alert.alertType)}`}>
                      {alert.alertType}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Category:</span> {alert.category}
                    </div>
                    <div>
                      <span className="font-medium">Quantity:</span> {alert.quantity}
                    </div>
                    <div>
                      <span className="font-medium">Price:</span> ${alert.price.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Expiry:</span>
                      {new Date(alert.expiryDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
