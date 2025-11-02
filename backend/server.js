const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const menuRouter = require('./routes/menuRoutes');
const authRouter = require('./routes/auth');
const orderRouter = require('./routes/orderRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: 'https://restaurant-management-system-orcin.vercel.app' })); // Update with your exact Vercel URL

// Routes
app.use('/api/menu', menuRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', orderRouter);

// Environment Variables
const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      dbName: 'restaurantDB',
    });
    console.log('MongoDB connected successfully.');

    // Start server only after DB connection
    app.listen(port, () => {
      console.log(`Server running on port ${port} at ${process.env.RAILWAY_URL || `http://localhost:${port}`}`);
    });
  } catch (error) {
    console.log('MongoDB connection error: ', error);
    process.exit(1);
  }
};

connectDB();

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Restaurant Management System API!' });
});