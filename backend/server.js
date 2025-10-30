const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 5000;

const mongoose = require('mongoose');
const router = require('./routes/menuRoutes');

app.use(morgan('dev'));

app.use(express.json());
app.use('/api/menu', router);


// For connecting to MongoDB Atlas

// For local MongoDB
const uri = 'mongodb://127.0.0.1:27017/';

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