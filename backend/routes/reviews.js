const express = require('express');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.findAll({ 
      where: { productId: req.params.productId },
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get average rating for a product
router.get('/rating/:productId', async (req, res) => {
  try {
    const reviews = await Review.findAll({ 
      where: { productId: req.params.productId }
    });
    if (reviews.length === 0) {
      return res.json({ average: 0, count: 0 });
    }

    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    const average = (sum / reviews.length).toFixed(1);
    
    res.json({ average: parseFloat(average), count: reviews.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a review
router.post('/', auth, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const review = await Review.create({
      productId,
      userId: req.user.userId,
      userName: req.user.email, // Using email as name for now
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get review count for a product
router.get('/count/:productId', async (req, res) => {
  try {
    const count = await Review.count({ where: { productId: req.params.productId } });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
