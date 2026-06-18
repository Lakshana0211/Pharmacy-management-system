import React, { useEffect, useState } from 'react';
import { medicineAPI } from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    expiryDate: '',
  });

  useEffect(() => {
    fetchMedicines();
  }, [search]);

  const fetchMedicines = async () => {
    try {
      let response;
      if (search.trim()) {
        response = await medicineAPI.search(search);
      } else {
        response = await medicineAPI.getAll();
      }
      setMedicines(response.data);
      const uniqueCategories = [...new Set(response.data.map((m) => m.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (medicine) => {
    const today = new Date();
    const expiry = new Date(medicine.expiryDate);

    if (expiry < today) return 'Expired';
    if (medicine.quantity === 0) return 'Out of Stock';
    if (medicine.quantity < 10) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'badge-success';
      case 'Low Stock':
        return 'badge-warning';
      case 'Expired':
      case 'Out of Stock':
        return 'badge-danger';
      default:
        return '';
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: '',
      quantity: '',
      price: '',
      expiryDate: '',
    });
    setShowModal(true);
  };

  const handleEditClick = (medicine) => {
    setEditingId(medicine.id);
    setFormData(medicine);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await medicineAPI.update(editingId, formData);
      } else {
        await medicineAPI.create(formData);
      }
      setShowModal(false);
      fetchMedicines();
    } catch (error) {
      console.error('Error saving medicine:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await medicineAPI.delete(id);
        fetchMedicines();
      } catch (error) {
        console.error('Error deleting medicine:', error);
      }
    }
  };

  const filteredMedicines = medicines.filter(
    (m) => category === '' || m.category === category
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Medicines</h1>
        <button
          onClick={handleAddClick}
          className="btn btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add Medicine
        </button>
      </div>

      {/* Filters */}
      <div className="card grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Search</label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicines..."
              className="input-field pl-10"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="card overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((medicine) => (
              <tr key={medicine.id}>
                <td className="font-medium">{medicine.name}</td>
                <td>{medicine.category}</td>
                <td>{medicine.quantity}</td>
                <td>${medicine.price.toFixed(2)}</td>
                <td>{new Date(medicine.expiryDate).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${getStatusColor(getStatus(medicine))}`}>
                    {getStatus(medicine)}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleEditClick(medicine)}
                    className="btn btn-small text-blue-600 hover:text-blue-800 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(medicine.id)}
                    className="btn btn-small text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? 'Edit Medicine' : 'Add Medicine'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn bg-gray-300 text-gray-800 flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medicines;
