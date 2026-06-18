import React, { useEffect, useState } from 'react';
import { billAPI } from '../services/api';
import { FaSearch, FaEye } from 'react-icons/fa';

const SalesHistory = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    fetchBills();
  }, [search]);

  const fetchBills = async () => {
    try {
      let response;
      if (search.trim()) {
        response = await billAPI.search(search);
      } else {
        response = await billAPI.getAll();
      }
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (billId) => {
    try {
      const response = await billAPI.getById(billId);
      setSelectedBill(response.data);
    } catch (error) {
      console.error('Error fetching bill details:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Sales History</h1>

      {/* Search */}
      <div className="card">
        <label className="block text-gray-700 font-semibold mb-2">Search Invoices</label>
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice ID or date..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Sales Table */}
      <div className="card overflow-x-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">All Invoices</h2>
        {bills.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No invoices found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.id}>
                  <td className="font-medium">#{bill.id}</td>
                  <td>{new Date(bill.createdAt).toLocaleString()}</td>
                  <td>{bill.itemCount || 0}</td>
                  <td className="font-semibold text-green-600">${bill.total.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => handleViewDetails(bill.id)}
                      className="btn btn-small text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Bill Details Modal */}
      {selectedBill && (
        <div className="modal active">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Invoice Details</h2>
              <button
                onClick={() => setSelectedBill(null)}
                className="text-gray-600 text-2xl hover:text-gray-800"
              >
                ×
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Invoice ID</p>
                  <p className="text-lg font-bold text-gray-800">#{selectedBill.id}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Date</p>
                  <p className="text-lg font-bold text-gray-800">
                    {new Date(selectedBill.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {selectedBill.items && selectedBill.items.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Items</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBill.items.map((item) => (
                      <tr key={item.id}>
                        <td className="font-medium">{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="border-t-2 pt-4">
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total Amount:</span>
                <span className="text-green-600">${selectedBill.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBill(null)}
              className="btn btn-secondary w-full mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;
