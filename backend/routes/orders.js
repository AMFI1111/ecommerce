const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

const router = express.Router();

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod } = req.body;

    const order = await Order.create({
      userId: req.user.userId,
      email: req.user.email,
      items,
      total,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
      status: 'Processing'
    });

    // Clear the cart after order is placed
    const cart = await Cart.findOne({ where: { userId: req.user.userId } });
    if (cart) {
      await cart.update({ items: [] });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.findAll({ 
      where: { userId: req.user.userId }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single order by id
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      where: { 
        id: req.params.id,
        userId: req.user.userId 
      }
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status (admin functionality - simplified)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const [updated] = await Order.update(
      { status },
      { where: { id: req.params.id } }
    );
    
    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = await Order.findByPk(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
