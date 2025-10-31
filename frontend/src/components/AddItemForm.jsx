import { useState } from "react";

export default function AddItemForm({ onAdd }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const url = 'http://localhost:5000/api/menu';

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const data = {
      name,
      price: Number(price),
      category,
      description
    };

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to add item');
        return response.json();
      })
      .then(() => {
        onAdd();
        setName('');
        setPrice('');
        setCategory('');
        setDescription('');
      })
      .catch(error => console.error('Error: ', error))
      .finally(() => setLoading(false));
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto border border-gray-100">
      <h2 className="text-3xl font-bold text-center text-indigo-800 mb-8">
        Add New Menu Item
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Item Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., Chicken Tikka"
            required
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price (₹)
            </label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="500"
              required
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="e.g., Main Course"
              required
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="A delicious dish made with..."
            rows="3"
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 text-xl font-bold text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              Adding Item...
            </span>
          ) : (
            'Add to Menu'
          )}
        </button>
      </form>
    </div>
  );
}