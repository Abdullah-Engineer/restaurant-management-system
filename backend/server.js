const express = require('express');
const morgan = require('morgan');

const app = express();
require('dotenv').config();

const mongoose = require('mongoose');
const router = require('./routes/menuRoutes');

app.use(morgan('dev'));

app.use(express.json());
app.use('/api/menu', router);


const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

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