import { useState, useEffect, use } from "react";

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


  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center text-indigo-800 mb-8">
        Restaurant Management System
      </h1>

      {/* <h1 className="text-6xl font-bold text-red-500">
        Restaurant Management System
      </h1> */}


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
        <div className="mt-12 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">Edit Item</h2>
          <form className="space-y-4">
            <input
              value={editingItem.name}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
            <input
              value={editPrice}
              onChange={e => setEditPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Price"
            />
            <input
              value={editCategory}
              onChange={e => setEditCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Category"
            />
            <input
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Description"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}