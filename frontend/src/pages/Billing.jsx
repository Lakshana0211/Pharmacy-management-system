import React, { useState, useEffect } from 'react';
import { medicineAPI, billAPI } from '../services/api';
import { FaPlus, FaTrash, FaShoppingCart } from 'react-icons/fa';

const Billing = () => {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchMedicine, setSearchMedicine] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await medicineAPI.getAll();
      setMedicines(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setLoading(false);
    }
  };

  const handleSearchMedicine = async (value) => {
    setSearchMedicine(value);
    if (value.trim()) {
      try {
        const response = await medicineAPI.search(value);
        setMedicines(response.data);
      } catch (error) {
        console.error('Error searching:', error);
      }
    } else {
      fetchMedicines();
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

  const handleAddToCart = () => {
    if (!selectedMedicine || !quantity) {
      alert('Please select a medicine and enter quantity');
      return;
    }

    const status = getStatus(selectedMedicine);
    if (status === 'Expired') {
      alert('Cannot add expired medicine to cart');
      return;
    }

    if (parseInt(quantity) > selectedMedicine.quantity) {
      alert(`Insufficient stock. Available: ${selectedMedicine.quantity}`);
      return;
    }

    const cartItem = {
      medicineId: selectedMedicine.id,
      medicineName: selectedMedicine.name,
      quantity: parseInt(quantity),
      price: selectedMedicine.price,
      subtotal: parseInt(quantity) * selectedMedicine.price,
    };

    setCart([...cart, cartItem]);
    setSelectedMedicine(null);
    setQuantity('');
  };

  const handleRemoveFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  const handleGenerateInvoice = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    try {
      const response = await billAPI.create(cart, discount);
      alert(`Invoice generated successfully! Invoice ID: ${response.data.invoiceId}`);
      setCart([]);
      setDiscount(0);
      setSelectedMedicine(null);
      setQuantity('');
    } catch (error) {
      alert('Error generating invoice: ' + error.response?.data?.error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Billing</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Medicine Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Select Medicine */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add Medicines</h2>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Search Medicine</label>
              <input
                type="text"
                value={searchMedicine}
                onChange={(e) => handleSearchMedicine(e.target.value)}
                placeholder="Search by name or category..."
                className="input-field"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Select Medicine</label>
              <select
                value={selectedMedicine?.id || ''}
                onChange={(e) => {
                  const medicine = medicines.find((m) => m.id === parseInt(e.target.value));
                  setSelectedMedicine(medicine);
                }}
                className="input-field"
              >
                <option value="">Choose a medicine...</option>
                {medicines.map((medicine) => {
                  const status = getStatus(medicine);
                  return (
                    <option key={medicine.id} value={medicine.id}>
                      {medicine.name} - ${medicine.price.toFixed(2)} ({medicine.quantity} in stock) [{status}]
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedMedicine && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700">
                  <strong>Price:</strong> ${selectedMedicine.price.toFixed(2)}
                </p>
                <p className="text-gray-700">
                  <strong>Available Stock:</strong> {selectedMedicine.quantity}
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="input-field"
              />
            </div>

            <button
              onClick={handleAddToCart}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              <FaPlus /> Add to Cart
            </button>
          </div>

          {/* Cart Items */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaShoppingCart /> Cart Items ({cart.length})
            </h2>
            {cart.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Cart is empty</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index}>
                      <td className="font-medium">{item.medicineName}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${item.subtotal.toFixed(2)}</td>
                      <td>
                        <button
                          onClick={() => handleRemoveFromCart(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right side - Bill Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Bill Summary</h2>

            <div className="space-y-3 mb-6 pb-6 border-b-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="input-field"
                />
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount ({discount}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between mb-6 text-xl font-bold">
              <span>Grand Total:</span>
              <span className="text-green-600">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleGenerateInvoice}
              disabled={cart.length === 0}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
