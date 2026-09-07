import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import './Header.css';

const Header = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const { user, logout } = useAuth();
  const { getWishlistCount } = useWishlist();
  const wishlistCount = getWishlistCount();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>MyStore</h1>
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
        </nav>

        <div className="header-actions">
          {user ? (
            <div className="user-menu">
              <Link to="/account" className="account-link">
                <span className="user-icon">👤</span>
                <span className="user-name">{user.name || user.email}</span>
              </Link>
              <button onClick={handleLogout} className="logout-link">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="auth-link">Sign In</Link>
              <Link to="/signup" className="auth-link signup-link">Sign Up</Link>
            </div>
          )}

          <Link to="/wishlist" className="wishlist-link">
            <span className="wishlist-icon">❤️</span>
            {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
          </Link>

          <Link to="/cart" className="cart-link">
            <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;