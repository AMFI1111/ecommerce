import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      clearWishlist();
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="empty-wishlist">
          <h1>Your Wishlist is Empty</h1>
          <p>Save your favorite items for later by adding them to your wishlist.</p>
          <Link to="/products" className="continue-shopping-btn">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
      </div>

      <div className="wishlist-container">
        <div className="wishlist-items">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-item">
              <div className="wishlist-item-image">
                <img src={item.image} alt={item.name} />
              </div>
              
              <div className="wishlist-item-details">
                <Link to={`/product/${item.id}`} className="wishlist-item-name">
                  {item.name}
                </Link>
                <div className="wishlist-item-category">{item.category}</div>
                <div className="wishlist-item-rating">
                  {'★'.repeat(Math.floor(item.rating))}
                  {'☆'.repeat(5 - Math.floor(item.rating))}
                  <span>({item.rating})</span>
                </div>
                <div className="wishlist-item-price">${item.price.toFixed(2)}</div>
              </div>

              <div className="wishlist-item-actions">
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveFromWishlist(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button className="clear-wishlist-btn" onClick={handleClearWishlist}>
            Clear Wishlist
          </button>
        </div>

        <div className="wishlist-summary">
          <h2>Wishlist Summary</h2>
          <div className="summary-row">
            <span>Total Items</span>
            <span>{wishlist.length}</span>
          </div>
          <div className="summary-row">
            <span>Total Value</span>
            <span>${wishlist.reduce((total, item) => total + item.price, 0).toFixed(2)}</span>
          </div>
          <Link to="/products" className="continue-shopping-link">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
