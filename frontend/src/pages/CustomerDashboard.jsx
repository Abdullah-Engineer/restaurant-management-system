import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [activeView, setActiveView] = useState('menu');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/menu');
        if (!response.ok) throw new Error('Failed to fetch menu');
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error('Menu fetch error:', error);
        alert('Could not load menu. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (token && activeView === 'orders') {
        try {
          const response = await fetch('http://localhost:5000/api/orders/user', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error('Failed to fetch orders');
          const data = await response.json();
          setOrders(data);
        } catch (error) {
          console.error('Orders fetch error:', error);
        }
      }
    };
    fetchOrders();
  }, [activeView]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem._id === existingItem._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item._id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCart(cart.map(item =>
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCart([]);
    }
  };

  const placeOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to place an order');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: cart })
      });
      if (!response.ok) throw new Error('Order placement failed');
      const data = await response.json();
      alert('Order placed successfully!');
      setCart([]); // Clear cart after successful order
      setOrders(prev => [data, ...prev].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (error) {
      console.error('Order placement error:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (loading) return <div className="flex justify-center py-16"><p className="text-xl text-indigo-800">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-indigo-800">Restaurant Menu</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveView('menu')}
                className={`px-4 py-2 rounded-lg font-medium ${activeView === 'menu'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                🍽️ Menu
              </button>
              <button
                onClick={() => setActiveView('cart')}
                className={`px-4 py-2 rounded-lg font-medium relative ${activeView === 'cart'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                🛒 Cart {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveView('orders')}
                className={`px-4 py-2 rounded-lg font-medium ${activeView === 'orders'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                📋 Orders
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {activeView === 'menu' && (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Our Delicious Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menu.length > 0 ? (
                menu.map(item => (
                  <div key={item._id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-2xl font-bold text-indigo-600 mb-2">Rs. {item.price}</p>
                    <p className="text-gray-600 mb-2">{item.category}</p>
                    {item.description && (
                      <p className="text-gray-500 text-sm mb-4">{item.description}</p>
                    )}
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">No menu items available.</p>
                </div>
              )}
            </div>
          </>
        )}
        {activeView === 'cart' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Your Cart</h2>
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-600">Your cart is empty</h3>
                <p className="text-gray-500">Add some delicious items from the menu!</p>
                <button
                  onClick={() => setActiveView('menu')}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {cart.map(item => (
                  <div key={item._id} className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-indigo-600 font-bold">Rs. {item.price} each</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-indigo-600">Rs. {getTotalPrice().toFixed(2)}</span>
                  </div>
                  <button
                    onClick={placeOrder}
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-lg hover:from-green-600 hover:to-emerald-700 text-lg font-bold"
                  >
                    Place Order
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {activeView === 'orders' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Order History</h2>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No orders yet.</p>
                <button
                  onClick={() => setActiveView('menu')}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {orders.map(order => (
                  <div key={order._id} className="py-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Order #{order._id.slice(-6)}</h3>
                    <p className="text-gray-600">Date: {new Date(order.timestamp).toLocaleDateString()}</p>
                    <ul className="mt-2">
                      {order.items.map(item => (
                        <li key={item.menuId} className="flex justify-between">
                          <span>{item.name} x{item.quantity}</span>
                          <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-indigo-600 font-bold">Total: Rs. {order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</p>
                    <p className="mt-1 text-gray-700">Status: {order.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}