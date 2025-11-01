const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();

    res.status(201).json(savedOrder);

  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        error: 'Order not found!'
      });
    }
    res.status(200).json(order);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID Format'
      });
    }
    res.status(500).json({
      error: error.message
    });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    const item = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (item) {
      return res.status(200).json(item);
    } else {
      res.status(404).json({
        error: "Item not updated"
      });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID Format'
      });
    }
    res.status(500).json({
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Order.findByIdAndDelete(id);

    if (item) {
      res.status(200).json({
        message: 'Item deleted successfully'
      });
    } else {
      res.status(404).json({
        error: 'Item not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


module.exports = router;