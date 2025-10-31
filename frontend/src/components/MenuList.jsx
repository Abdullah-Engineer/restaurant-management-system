export default function MenuList({ menu, onEdit, onDelete }) {
  return (
    <div className="space-y-4 mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Menu</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menu.map(item => (
          <div key={item._id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-indigo-500">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
            <p className="text-2xl font-bold text-indigo-600 mb-1">Rs. {item.price}</p>
            <p className="text-gray-600 mb-4">{item.category}</p>
            {item.description && (
              <p className="text-sm text-gray-500 mb-4 italic">{item.description}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(item)}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}