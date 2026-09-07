// Import useParams to get product ID from URL, Link for navigation
import { useParams, Link } from 'react-router-dom';
// Import useState, useEffect for managing component state
import { useState, useEffect } from 'react';
// Import products API
import { productsAPI } from '../utils/api';
// Import cart context hook to access cart functions
import { useCart } from '../context/CartContext';
// Import reviews context hooks to access review functions
import { useReviews } from '../context/ReviewsContext';
// Import auth context hook to access user authentication
import { useAuth } from '../context/AuthContext';
// Import CSS styles for ProductDetails component
import './ProductDetails.css';

// ProductDetails component - displays detailed information about a single product
// Shows product images, info, reviews, and allows users to add reviews
const ProductDetails = () => {
  // Get the product ID from the URL parameters
  const { id } = useParams();
  // Access addToCart function from CartContext
  const { addToCart } = useCart();
  // Access review functions from ReviewsContext
  const { addReview, getProductReviews, getProductRating, getReviewCount } = useReviews();
  // Access user authentication state from AuthContext
  const { user } = useAuth();
  // State for product data
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  // State for review form data (rating and comment)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  // State to control visibility of review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  // State to track which product image is currently selected
  const [selectedImage, setSelectedImage] = useState(0);
  // State for reviews
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await productsAPI.getById(id);
      setProduct(productData);
      
      // Load reviews
      const [productReviews, ratingData, countData] = await Promise.all([
        getProductReviews(id),
        getProductRating(id),
        getReviewCount(id)
      ]);
      setReviews(productReviews);
      setAverageRating(ratingData);
      setReviewCount(countData);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get product images array, or use single image if images array doesn't exist
  const productImages = product?.images || [product?.image];

  // If loading, show loading state
  if (loading) {
    return (
      <div className="product-details-page">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  // If product is not found, display a "Product Not Found" message
  if (!product) {
    return (
      <div className="product-details-page">
        <div className="product-not-found">
          <h1>Product Not Found</h1>
          <Link to="/products" className="back-link">Back to Products</Link>
        </div>
      </div>
    );
  }

  // Handler function to add the current product to cart
  const handleAddToCart = () => {
    addToCart(product.id); // Call addToCart function from CartContext with product ID
  };

  // Handler function to submit a new review
  const handleReviewSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // Check if user is logged in before allowing review submission
    if (!user) {
      alert('Please sign in to leave a review');
      return;
    }
    try {
      // Add the review using the addReview function from ReviewsContext
      await addReview(id, {
        rating: parseInt(reviewForm.rating), // Convert rating to number
        comment: reviewForm.comment, // Review comment text
      });
      // Reset the review form to initial state
      setReviewForm({ rating: 5, comment: '' });
      // Hide the review form after submission
      setShowReviewForm(false);
      // Reload reviews
      await loadProduct();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  // Render the product details page with images, info, and reviews
  return (
    <div className="product-details-page">
      <div className="product-details-container">
        {/* Product Image Section - displays main image and thumbnails */}
        <div className="product-image-section">
          <div className="main-image-container">
            {/* Main product image - displays the currently selected image */}
            <img 
              src={productImages[selectedImage]} 
              alt={product.name} 
              className="product-detail-image" 
            />
          </div>
          {/* Thumbnail navigation - only show if product has multiple images */}
          {productImages.length > 1 && (
            <div className="image-thumbnails">
              {/* Map through images to create thumbnail buttons */}
              {productImages.map((image, index) => (
                <button
                  key={index}
                  // Add 'active' class if this thumbnail is currently selected
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  // Click to select this image as the main image
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} view ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info Section - displays product details and actions */}
        <div className="product-info-section">
          {/* Breadcrumb navigation - shows path to current product */}
          <div className="product-breadcrumb">
            <Link to="/products">Products</Link>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span>{product.name}</span>
          </div>

          {/* Product name */}
          <h1 className="product-detail-name">{product.name}</h1>
          
          {/* Product rating display with stars and review count */}
          <div className="product-detail-rating">
            {'★'.repeat(Math.floor(averageRating || product.rating))}
            {'☆'.repeat(5 - Math.floor(averageRating || product.rating))}
            <span>({averageRating || product.rating} rating, {reviewCount} reviews)</span>
          </div>

          {/* Product price */}
          <div className="product-detail-price">${product.price.toFixed(2)}</div>

          {/* Product category */}
          <div className="product-detail-category">
            <span className="label">Category:</span>
            <span>{product.category}</span>
          </div>

          {/* Product stock availability */}
          <div className="product-detail-stock">
            <span className="label">In Stock:</span>
            <span>{product.stock} items</span>
          </div>

          {/* Product description */}
          <div className="product-detail-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Add to cart button */}
          <button className="add-to-cart-btn-large" onClick={handleAddToCart}>
            Add to Cart
          </button>

          {/* Back to products link */}
          <Link to="/products" className="back-to-products">
            ← Back to Products
          </Link>
        </div>
      </div>

      {/* Reviews Section - displays customer reviews and review form */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          {/* Toggle button to show/hide review form */}
          <button 
            className="write-review-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        {/* Review form - only visible when showReviewForm is true */}
        {showReviewForm && (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <div className="form-group">
              <label>Rating</label>
              <select
                value={reviewForm.rating}
                // Update rating when user selects different option
                onChange={(e) => setReviewForm({...reviewForm, rating: e.target.value})}
              >
                <option value="5">5 Stars - Excellent</option>
                <option value="4">4 Stars - Good</option>
                <option value="3">3 Stars - Average</option>
                <option value="2">2 Stars - Poor</option>
                <option value="1">1 Star - Terrible</option>
              </select>
            </div>
            <div className="form-group">
              <label>Your Review</label>
              <textarea
                value={reviewForm.comment}
                // Update comment when user types
                onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                placeholder="Share your experience with this product..."
                required
                rows="4"
              />
            </div>
            <button type="submit" className="submit-review-btn">
              Submit Review
            </button>
          </form>
        )}

        {/* Reviews list - displays all reviews or no reviews message */}
        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
          ) : (
            // Map through reviews to display each review
            reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <span className="review-author">{review.userName}</span>
                  <span className="review-date">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="review-rating">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;