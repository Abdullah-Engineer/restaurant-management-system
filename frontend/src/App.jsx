import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import MenuList from "./components/MenuList";
import AddItemForm from "./components/AddItemForm";
import OrderList from "./components/OrderList";

export default function App() {
  const [menu, setMenu] = useState([]);
  const [view, setView] = useState('menu');

  const [orders, setOrders] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const [ordersLoading, setOrdersLoading] = useState(false);

  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const editFormRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const refreshMenu = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await fetch("http://localhost:5000/api/menu");
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMenu();
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/menu/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
      })
      .then(() => {
        console.log('Resource Deleted Successfully');
        refreshMenu();
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  useEffect(() => {
    if (editingItem) {
      setEditName(editingItem.name);
      setEditPrice(editingItem.price);
      setEditCategory(editingItem.category);
      setEditDescription(editingItem.description || '');
    }
  }, [editingItem]);

  const handleSave = () => {
    fetch(`http://localhost:5000/api/menu/${editingItem._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: editingItem.name,
        price: Number(editPrice),
        category: editCategory,
        description: editDescription
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Update Failed!');
        }
        return response.json();
      })
      .then(() => {
        refreshMenu();
        setEditingItem(null);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (editingItem && editFormRef.current) {
      editFormRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [editingItem]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && location.pathname === '/') {
      navigate('/admin');
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (view === 'orders') {
      setOrdersLoading(true);
      fetch('http://localhost:5000/api/orders', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(response => response.json())
        .then(data => setOrders(data))
        .finally(() => setOrdersLoading(false));
    }
  }, [view]);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update status');
      const data = await response.json();
      setOrders(orders.map(order => order._id === id ? data : order));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDeleteOrder = async (id) => {
    await fetch(`http://localhost:5000/api/orders/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    fetch('http://localhost:5000/api/orders', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => response.json())
      .then(data => setOrders(data));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header Section with Title and Logout */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-800">
          Restaurant Management System
        </h1>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Log Out
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setView('menu')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${view === 'menu'
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          🍽️ Menu Management
        </button>
        <button
          onClick={() => setView('orders')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${view === 'orders'
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          📦 Order Management
        </button>
      </div>

      {/* Menu View */}
      {view === 'menu' && (
        <>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
              <p className="mt-6 text-xl font-semibold text-indigo-700">Loading Menu...</p>
            </div>
          ) : (
            <MenuList menu={menu} onDelete={handleDelete} onEdit={handleEdit} />
          )}

          <div className="mt-12">
            <AddItemForm onAdd={refreshMenu} />
          </div>
        </>
      )}

      {/* Orders View */}
      {view === 'orders' && (
        ordersLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="mt-6 text-xl font-semibold text-indigo-700">Loading Orders...</p>
          </div>
        ) : (
          <OrderList orders={orders} updateStatus={updateStatus} deleteOrder={handleDeleteOrder} />
        )
      )}

      {/* Edit Form (Modal-like) */}
      {editingItem && (
        <div ref={editFormRef} className="mt-16 bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto border border-gray-100">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-8">
            Edit Menu Item
          </h2>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name
                <input
                  value={editingItem.name}
                  readOnly
                  className="w-full px-4 py-3 text-lg bg-gray-100 border-2 border-gray-300 rounded-xl cursor-not-allowed"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (Rs.)
                  <input
                    value={editPrice}
                    onChange={e => setEditPrice(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-indigo-500 rounded-xl focus:ring-4 focus:ring-indigo-100"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category
                  <input
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-indigo-500 rounded-xl focus:ring-4 focus:ring-indigo-100"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description
                <textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 text-lg border-2 border-indigo-500 rounded-xl focus:ring-4 focus:ring-indigo-100 resize-none"
                />
              </label>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-8 py-3 text-lg font-bold bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-8 py-3 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}