import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { OrdersProvider } from './context/OrdersContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import OrderHistory from './pages/OrderHistory';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <ReviewsProvider>
          <OrdersProvider>
            <CartProvider>
              <Router>
                <div className="app">
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/orders" element={<OrderHistory />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </Router>
            </CartProvider>
          </OrdersProvider>
        </ReviewsProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;