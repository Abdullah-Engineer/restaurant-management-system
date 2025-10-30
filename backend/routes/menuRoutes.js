const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');


router.post('/', async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    const savedItem = await menuItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});


router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({
        error: "Item not found"
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
    })
  }
});


router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;

    const item = await MenuItem.findByIdAndUpdate(id, update, { new: true });

    if (item) {
      return res.status(202).json(item);
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
    const item = await MenuItem.findByIdAndDelete(req.params.id);

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




module.exports = router;