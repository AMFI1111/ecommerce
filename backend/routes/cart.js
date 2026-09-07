const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ where: { userId: req.user.userId } });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.userId, items: [] });
    }
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Get product details
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ where: { userId: req.user.userId } });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.userId, items: [] });
    }

    // Check if item already exists
    const items = cart.items || [];
    const existingItem = items.find(item => item.productId === parseInt(productId));
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({
        productId: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        quantity: 1
      });
    }

    await cart.update({ items });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.userId } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const items = (cart.items || []).filter(item => item.productId !== parseInt(req.params.productId));
    await cart.update({ items });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update item quantity
router.put('/update/:productId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ where: { userId: req.user.userId } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const items = cart.items || [];
    const item = items.find(item => item.productId === parseInt(req.params.productId));
    if (item) {
      item.quantity = quantity;
      await cart.update({ items });
    }

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.userId } });
    if (cart) {
      await cart.update({ items: [] });
    }
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
