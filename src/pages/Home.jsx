import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productsAPI } from '../utils/api';
import ProductCard from '../components/products/ProductCard';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get first 4 products as featured products
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to MyStore</h1>
          <p>Discover amazing products at unbeatable prices</p>
          <Link to="/products" className="cta-button">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="feature-item">
            <div className="feature-icon">🚚</div>
            <h3>Free Shipping</h3>
            <p>On orders over $50</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <h3>Secure Payment</h3>
            <p>100% secure checkout</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">↩️</div>
            <h3>Easy Returns</h3>
            <p>30-day return policy</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💬</div>
            <h3>24/7 Support</h3>
            <p>Dedicated support team</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="featured-header">
          <h2>Featured Products</h2>
          <p>Check out our best-selling items</p>
        </div>
        
        <div className="featured-products-grid">
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        <div className="view-all-container">
          <Link to="/products" className="view-all-btn">
            View All Products
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="categories-header">
          <h2>Shop by Category</h2>
          <p>Browse our wide range of categories</p>
        </div>
        
        <div className="categories-grid">
          <Link to="/products" className="category-card">
            <div className="category-content">
              <h3>Electronics</h3>
              <p>Latest gadgets and devices</p>
            </div>
          </Link>
          <Link to="/products" className="category-card">
            <div className="category-content">
              <h3>Fashion</h3>
              <p>Trendy clothing and accessories</p>
            </div>
          </Link>
          <Link to="/products" className="category-card">
            <div className="category-content">
              <h3>Home</h3>
              <p>Everything for your home</p>
            </div>
          </Link>
          <Link to="/products" className="category-card">
            <div className="category-content">
              <h3>Sports</h3>
              <p>Fitness and outdoor gear</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;