import { useEffect, useState } from "react";

export default function MenuList({ menu, onEdit, onDelete }) {
  return (
    <div>
      <h2>Our Menu</h2>

      {
        menu.map(item => (
          <div key={item._id}>
            <h3>{item.name}</h3>
            <p>Price: {item.price}</p>
            <p>Category: {item.category}</p>
            <button onClick={() => onEdit(item)}>Edit</button>
            <button onClick={() => onDelete(item._id)}>Delete</button>
            <hr />
          </div>
        ))
      }
    </div>
  )
}