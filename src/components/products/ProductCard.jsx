// Import Link component from React Router for navigation
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
// Import cart context hook to access cart functions
import { useCart } from '../../context/CartContext';
// Import wishlist context hooks to access wishlist functions
import { useWishlist } from '../../context/WishlistContext';
// Import CSS styles for ProductCard component
import './ProductCard.css';

// ProductCard component - displays a single product with image, info, and action buttons
// Accepts 'product' prop containing product data (id, name, price, image, etc.)
const ProductCard = ({ product }) => {
  // Access addToCart function from CartContext
  const { addToCart } = useCart();
  // Access wishlist functions from WishlistContext
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  // State for loading and wishlist status
  const [loading, setLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  // Check wishlist status on mount and when product changes
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const result = await isInWishlist(product.id);
        setInWishlist(result.exists);
      } catch (error) {
        console.error('Error checking wishlist:', error);
      }
    };
    checkWishlist();
  }, [product.id]);

  // Handler function for adding product to cart
  // Prevents default link behavior when clicking add to cart button
  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation to product details page
    setLoading(true);
    try {
      await addToCart(product.id); // Add the product to cart using CartContext function
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handler function for toggling product in wishlist (add/remove)
  // Prevents default link behavior and stops event propagation
  const handleWishlistToggle = async (e) => {
    e.preventDefault(); // Prevent navigation to product details page
    e.stopPropagation(); // Stop event from bubbling up to parent Link
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id); // Remove from wishlist if already present
        setInWishlist(false);
      } else {
        await addToWishlist(product.id); // Add to wishlist if not present
        setInWishlist(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <button 
        className={`wishlist-btn ${inWishlist ? 'in-wishlist' : ''}`}
        onClick={handleWishlistToggle}
      >
        {inWishlist ? '❤️' : '🤍'}
      </button>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          {'★'.repeat(Math.floor(product.rating))}
          {'☆'.repeat(5 - Math.floor(product.rating))}
          <span>({product.rating})</span>
        </div>
        <div className="product-price">${product.price.toFixed(2)}</div>
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;