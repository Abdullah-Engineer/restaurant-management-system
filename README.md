# Restaurant Management System

A comprehensive full-stack application for managing restaurant operations. It includes an admin dashboard for menu and order management, and a customer interface for browsing menus, adding items to cart, placing orders, and tracking order status. The system is built with modern web technologies for secure and efficient usage.

## Features

### Admin Dashboard
- Secure login/logout with JWT authentication.
- Menu management: Add, edit, and delete menu items (name, price, category, description).
- Order management: View all orders, update order status (pending, preparing, ready, delivered), and delete orders.
- Real-time data refresh after updates.

### Customer Dashboard
- User registration, login, and logout with JWT authentication.
- Browse menu items with details (name, price, category, description).
- Cart functionality: Add items, update quantity, remove items, and view total price.
- Place orders from the cart.
- View order history and track order status.

## Tech Stack

### Frontend
- React.js for building the user interface.
- Vite for fast development and bundling.
- Tailwind CSS for styling.
- React Router for client-side routing.
- jwt-decode for JWT token decoding.

### Backend
- Node.js and Express.js for server-side logic.
- MongoDB with Mongoose for data storage.
- bcrypt for password hashing.
- jsonwebtoken for JWT authentication.
- morgan for logging.
- cors for handling cross-origin requests.

## Installation

### Backend
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with necessary variables (e.g., MONGODB_URI, PORT, JWT_SECRET).
4. Start the server:
   ```
   npm run dev
   ```

### Frontend
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with VITE_API_URL pointing to the backend API.
4. Start the development server:
   ```
   npm run dev
   ```

## Usage

### Admin
- Access the admin dashboard after logging in with admin credentials.
- Manage menu items and monitor/update orders.

### Customer
- Register or login to the customer dashboard.
- Browse the menu, add items to cart, place orders, and track status.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
