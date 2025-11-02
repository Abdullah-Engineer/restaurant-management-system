export default function OrderList({ orders, updateStatus, deleteOrder }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '⏳ Pending';
      case 'preparing': return '👨‍🍳 Preparing';
      case 'ready': return '✅ Ready';
      case 'delivered': return '📦 Delivered';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">Order Management</h2>
        <p className="text-indigo-100 text-sm mt-1">
          {orders.length} order{orders.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">#{order._id.slice(-4)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        User: {order.userId}
                      </p>
                      <ul className="text-sm text-gray-500 mt-1">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.name} (Qty: {item.quantity}, Rs. {item.price * item.quantity})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border-0 text-sm font-medium transition-all ${getStatusColor(order.status)} focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer`}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="preparing">👨‍🍳 Preparing</option>
                    <option value="ready">✅ Ready</option>
                    <option value="delivered">📦 Delivered</option>
                  </select>
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(order.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.timestamp).toLocaleTimeString()}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500">Orders will appear here when customers place them.</p>
          </div>
        )}
      </div>
    </div>
  );
}