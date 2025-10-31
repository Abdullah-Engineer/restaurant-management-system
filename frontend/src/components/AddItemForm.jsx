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

    const data = { name, price: Number(price), category, description };

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Success: ', data);
        onAdd();
      })
      .then(() => {
        setName('');
        setPrice('');
        setCategory('');
        setDescription('');
      })
      .catch(error => {
        console.error('Error: ', error)
      })
      .finally(() => setLoading(false));
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Item Name:
        <input
          type="text"
          name="item-name"
          value={name}
          placeholder="Item Name"
          onChange={event => setName(event.target.value)}
          required
        />
      </label>

      <label>Item Price:
        <input
          type="number"
          name="item-price"
          value={price}
          placeholder="Item Price"
          onChange={event => setPrice(event.target.value)}
          required
        />
      </label>

      <label>Item Category:
        <input
          type="text"
          name="item-category"
          value={category}
          placeholder="Item Category"
          onChange={event => setCategory(event.target.value)}
          required
        />
      </label>

      <label>Item Description:
        <textarea
          name="item-description"
          value={description}
          placeholder="Item Description"
          onChange={event => setDescription(event.target.value)}
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Item'}
      </button>

    </form>
  )
}