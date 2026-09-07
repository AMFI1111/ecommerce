// FILE PURPOSE: This file manages the shopping cart state globally using React Context.
// It provides cart data and functions (add, remove, update, etc.) to all components in the app.
// It now uses API calls to the backend instead of localStorage.

// Import React hooks needed for context and state management
import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';

// Create a context object - this is the "data storage" for cart state
// Components will access this through the useCart hook below
const CartContext = createContext();

// CartProvider is a React component that wraps the app to provide cart context to all children
// It accepts 'children' prop which represents all components inside the provider
export const CartProvider = ({ children }) => {
  // cart state: holds array of products in cart
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load cart from backend when user logs in
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const items = await cartAPI.get();
      setCart(items);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a product to the cart
  const addToCart = async (productId) => {
    try {
      const updatedCart = await cartAPI.add(productId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  // Function to remove a product from cart by its ID
  const removeFromCart = async (productId) => {
    try {
      const updatedCart = await cartAPI.remove(productId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  // Function to update quantity of a specific product in cart
  const updateQuantity = async (productId, newQuantity) => {
    // If quantity is 0 or negative, remove the item instead
    if (newQuantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    
    try {
      const updatedCart = await cartAPI.update(productId, newQuantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  };

  // Function to completely empty the cart
  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  // Helper function to calculate total price of all items in cart
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Helper function to get total number of items in cart (sum of all quantities)
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Render the Context Provider with all cart data and functions available to children
  return (
    <CartContext.Provider
      value={{
        cart,           // The cart array of products
        addToCart,      // Function to add items
        removeFromCart, // Function to remove items
        updateQuantity, // Function to change quantities
        clearCart,      // Function to empty cart
        getCartTotal,   // Function to get total price
        getCartCount,   // Function to get item count
        loading,        // Loading state
      }}
    >
      {children} {/* Render all child components inside the provider */}
    </CartContext.Provider>
  );
};

// Custom hook that components use to access cart context
// This is the convenience wrapper that makes it easy for components to get cart data
export const useCart = () => {
  // Access the CartContext using React's useContext hook
  const context = useContext(CartContext);
  // Error handling: if hook is used outside CartProvider, throw error
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  // Return the context object (contains cart state and all functions)
  return context;
};