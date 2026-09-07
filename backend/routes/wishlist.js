const express = require('express');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ where: { userId: req.user.userId } });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.userId, items: [] });
    }
    res.json(wishlist.items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to wishlist
router.post('/add', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Get product details
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ where: { userId: req.user.userId } });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.userId, items: [] });
    }

    // Check if item already exists
    const items = wishlist.items || [];
    const existingItem = items.find(item => item.productId === parseInt(productId));
    if (existingItem) {
      return res.json(items);
    }

    items.push({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
      category: product.category,
      description: product.description,
      rating: parseFloat(product.rating)
    });

    await wishlist.update({ items });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove item from wishlist
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ where: { userId: req.user.userId } });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const items = (wishlist.items || []).filter(item => item.productId !== parseInt(req.params.productId));
    await wishlist.update({ items });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check if item is in wishlist
router.get('/check/:productId', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ where: { userId: req.user.userId } });
    if (!wishlist) {
      return res.json({ exists: false });
    }

    const items = wishlist.items || [];
    const exists = items.some(item => item.productId === parseInt(req.params.productId));
    res.json({ exists });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear wishlist
router.delete('/clear', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ where: { userId: req.user.userId } });
    if (wishlist) {
      await wishlist.update({ items: [] });
    }
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
