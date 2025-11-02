const express = require('express');
const morgan = require('morgan');

const app = express();
require('dotenv').config();

const cors = require('cors');

const mongoose = require('mongoose');
const menuRouter = require('./routes/menuRoutes');
const authRouter = require('./routes/auth');

const orderRouter = require('./routes/orderRoutes');


app.use(morgan('dev'));
app.use(cors());

app.use(express.json());
app.use('/api/menu', menuRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', orderRouter);

const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: 'https://your-vercel-url.vercel.app' }));

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      dbName: 'restaurantDB'
    });
    console.log('MongoDB connected successfully.');

    // Ensuring server only runs when DB is ready
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });

  } catch (error) {
    console.log('MongoDB connection error: ', error);
    process.exit(1);
  }
};

connectDB();

app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Restaurant Management System API!" });
});