// Import React hooks for state management and side effects
import { useState, useEffect } from 'react';
// Import Link component for navigation
import { Link } from 'react-router-dom';
// Import cart context hooks to access cart functions
import { useCart } from '../context/CartContext';
// Import auth context hook to access user authentication
import { useAuth } from '../context/AuthContext';
// Import orders context hook to access order functions
import { useOrders } from '../context/OrdersContext';
// Import CSS styles for Checkout component
import './Checkout.css';

// Checkout component - handles order processing with form validation and payment simulation
const Checkout = () => {
  // Access cart functions from CartContext
  const { cart, getCartTotal, clearCart } = useCart();
  // Access user authentication state from AuthContext
  const { user } = useAuth();
  // Access addOrder function from OrdersContext
  const { addOrder } = useOrders();
  // State for form data - contains all checkout form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  // State for form validation errors
  const [errors, setErrors] = useState({});
  // State to track if form is currently being submitted
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State to track if order has been completed successfully
  const [orderComplete, setOrderComplete] = useState(false);

  // useEffect hook: pre-fill form with user data if user is logged in
  // Runs whenever user state changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        // Try to get firstName from user data, or split name, or use empty string
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        // Try to get lastName from user data, or split name, or use empty string
        lastName: user.lastName || user.name?.split(' ')[1] || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        zipCode: user.zipCode || '',
        country: user.country || ''
      }));
    }
  }, [user]); // Dependency array: run this effect whenever user changes

  // Handler function for form input changes
  // Updates formData state and clears validation errors for the changed field
  const handleChange = (e) => {
    const { name, value } = e.target; // Get field name and value from input
    setFormData(prev => ({
      ...prev,
      [name]: value // Update the specific field with new value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '' // Remove error message for this field
      }));
    }
  };

  // Form validation function - checks all required fields and formats
  // Returns true if form is valid, false otherwise
  const validateForm = () => {
    const newErrors = {};

    // Personal info validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'; // Regex for email validation
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    // Payment info validation
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Invalid card number (16 digits)'; // Regex for 16 digits
    }
    if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid format (MM/YY)'; // Regex for MM/YY format
    }
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Invalid CVV (3-4 digits)'; // Regex for 3-4 digits
    }

    setErrors(newErrors);
    // Return true if no errors (form is valid)
    return Object.keys(newErrors).length === 0;
  };

  // Handler function for form submission
  // Validates form, processes payment, and saves order
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // Validate form before submission
    if (!validateForm()) {
      return; // Stop if form is invalid
    }

    setIsSubmitting(true); // Set submitting state to true

    try {
      // Save order to OrdersContext with relevant data
      await addOrder({
        items: cart,
        total: getCartTotal(),
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: '',
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: 'Credit Card'
      });
      
      setOrderComplete(true); // Show order completion screen
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  // If cart is empty and order is not complete, show empty cart message
  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="checkout-page">
        <div className="empty-checkout">
          <h1>Your Cart is Empty</h1>
          <p>You need to add items to your cart before checkout.</p>
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // If order is complete, show order success screen
  if (orderComplete) {
    return (
      <div className="checkout-page">
        <div className="order-complete">
          <div className="success-icon">✓</div>
          <h1>Order Complete!</h1>
          <p>Thank you for your purchase. Your order has been successfully placed.</p>
          <p>Order confirmation would be sent to {formData.email}</p>
          <p className="note">Note: This is a demo - no actual email will be sent without a backend server.</p>
          <div className="order-actions">
            <Link to="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
            <Link to="/" className="home-link">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render the checkout form with personal info, shipping, payment, and order summary
  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <Link to="/cart" className="back-to-cart">
          ← Back to Cart
        </Link>
      </div>

      <div className="checkout-container">
        {/* Checkout form - handles user input for order processing */}
        <form onSubmit={handleSubmit} className="checkout-form">
          {/* Personal Information Section */}
          <div className="form-section">
            <h2>Personal Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>

          {/* Shipping Address Section */}
          <div className="form-section">
            <h2>Shipping Address</h2>
            <div className="form-group">
              <label htmlFor="address">Street Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">Zip Code *</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={errors.zipCode ? 'error' : ''}
                />
                {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={errors.country ? 'error' : ''}
              />
              {errors.country && <span className="error-message">{errors.country}</span>}
            </div>
          </div>

          {/* Payment Information Section */}
          <div className="form-section">
            <h2>Payment Information</h2>
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number *</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleChange}
                maxLength="19"
                className={errors.cardNumber ? 'error' : ''}
              />
              {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="cardName">Cardholder Name *</label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                className={errors.cardName ? 'error' : ''}
              />
              {errors.cardName && <span className="error-message">{errors.cardName}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date (MM/YY) *</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  maxLength="5"
                  className={errors.expiryDate ? 'error' : ''}
                />
                {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV *</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleChange}
                  maxLength="4"
                  className={errors.cvv ? 'error' : ''}
                />
                {errors.cvv && <span className="error-message">{errors.cvv}</span>}
              </div>
            </div>
          </div>

          {/* Submit button - disabled while processing */}
          <button 
            type="submit" 
            className="checkout-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : `Place Order - $${getCartTotal().toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary Section - displays cart items and totals */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {/* Map through cart items to display each item */}
            {cart.map(item => (
              <div key={item.id} className="summary-item">
                <div className="summary-item-info">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="summary-item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
