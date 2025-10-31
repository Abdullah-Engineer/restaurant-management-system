import { useState, useEffect, useRef } from "react";

import MenuList from "./components/MenuList";
import AddItemForm from "./components/AddItemForm";

export default function App() {
  const [menu, setMenu] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const editFormRef = useRef(null);


  const refreshMenu = async () => {
    setLoading(true);
    try {

      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch("http://localhost:5000/api/menu");
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error("Error: ", error)
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
  }

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
    if(editingItem && editFormRef.current) {
      editFormRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [editingItem]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center text-indigo-800 mb-8">
        Restaurant Management System
      </h1>

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

      {editingItem && (
        <div ref={editFormRef} className="mt-16 bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto border border-gray-100">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-8">
            Edit Menu Item
          </h2>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
              <input
                value={editingItem.name}
                readOnly
                className="w-full px-4 py-3 text-lg bg-gray-100 border-2 border-gray-300 rounded-xl cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (Rs.)</label>
                <input
                  value={editPrice}
                  onChange={e => setEditPrice(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-indigo-500 rounded-xl focus:ring-4 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <input
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-indigo-500 rounded-xl focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 text-lg border-2 border-indigo-500 rounded-xl focus:ring-4 focus:ring-indigo-100 resize-none"
              />
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