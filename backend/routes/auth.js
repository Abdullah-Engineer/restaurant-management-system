const express = require('express');
const router = express.Router();

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Admin Registration
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and Password are required.' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await newUser.save();

    console.log('Admin Created Successfully!');
    return res.status(201).json({ message: 'Admin Created Successfully!' });
  } catch (error) {
    console.error('Registration Error: ', error);
    return res.status(500).json({ message: 'Server Error during registration.' });
  }
});

// Customer Registration
router.post('/register-customer', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and Password are required.' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ email, password: hashedPassword }); // role defaults to 'customer'
    await newUser.save();
    const payload = { userId: newUser._id, role: newUser.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
    return res.status(201).json({ message: 'Customer registered', token });
  } catch (error) {
    console.error('Registration Error: ', error);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Login (Works for both admin and customer)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and Password are required.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const payload = {
      userId: user._id,
      role: user.role
    }

    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secretKey, { expiresIn: '2h' });

    console.log(`User ${user.email} successfully logged in. Token generated.`);
    return res.status(200).json({ token });

  } catch (error) {
    console.error('Login Error: ', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;