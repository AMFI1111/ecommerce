// Import React hooks needed for context and state management
import { createContext, useContext, useState, useEffect } from 'react';
import { reviewsAPI } from '../utils/api';

// Create a context object - this is the "data storage" for product reviews
// Components will access this through the useReviews hook below
const ReviewsContext = createContext();

// ReviewsProvider is a React component that wraps the app to provide reviews context to all children
// It accepts 'children' prop which represents all components inside the provider
export const ReviewsProvider = ({ children }) => {
  // reviews state: holds all product reviews organized by product ID
  const [reviews, setReviews] = useState({});
  const [ratings, setRatings] = useState({});
  const [reviewCounts, setReviewCounts] = useState({});

  // Function to add a new review for a specific product
  const addReview = async (productId, reviewData) => {
    try {
      await reviewsAPI.addReview({ productId, ...reviewData });
      // Refresh reviews and ratings for this product
      await refreshProductReviews(productId);
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };

  const refreshProductReviews = async (productId) => {
    try {
      const [productReviews, ratingData, countData] = await Promise.all([
        reviewsAPI.getProductReviews(productId),
        reviewsAPI.getProductRating(productId),
        reviewsAPI.getReviewCount(productId),
      ]);
      
      setReviews(prev => ({
        ...prev,
        [productId]: productReviews
      }));
      setRatings(prev => ({
        ...prev,
        [productId]: ratingData.average
      }));
      setReviewCounts(prev => ({
        ...prev,
        [productId]: countData.count
      }));
    } catch (error) {
      console.error('Error refreshing product reviews:', error);
    }
  };

  // Function to get all reviews for a specific product
  const getProductReviews = async (productId) => {
    try {
      if (!reviews[productId]) {
        await refreshProductReviews(productId);
      }
      return reviews[productId] || [];
    } catch (error) {
      console.error('Error getting product reviews:', error);
      return [];
    }
  };

  // Function to calculate average rating for a specific product
  const getProductRating = async (productId) => {
    try {
      if (ratings[productId] === undefined) {
        await refreshProductReviews(productId);
      }
      return ratings[productId] || 0;
    } catch (error) {
      console.error('Error getting product rating:', error);
      return 0;
    }
  };

  // Function to get the count of reviews for a specific product
  const getReviewCount = async (productId) => {
    try {
      if (reviewCounts[productId] === undefined) {
        await refreshProductReviews(productId);
      }
      return reviewCounts[productId] || 0;
    } catch (error) {
      console.error('Error getting review count:', error);
      return 0;
    }
  };

  // Render the Context Provider with all reviews data and functions available to children
  // The value prop contains everything child components can access via useReviews()
  return (
    <ReviewsContext.Provider
      value={{
        reviews, // All reviews data
        addReview, // Function to add new reviews
        getProductReviews, // Function to get reviews for a product
        getProductRating, // Function to get average rating
        getReviewCount, // Function to get review count
      }}
    >
      {children} {/* Render all child components inside the provider */}
    </ReviewsContext.Provider>
  );
};

// Custom hook that components use to access reviews context
// This is the convenience wrapper that makes it easy for components to get reviews data
export const useReviews = () => {
  // Access the ReviewsContext using React's useContext hook
  const context = useContext(ReviewsContext);
  // Error handling: if hook is used outside ReviewsProvider, throw error
  // This prevents bugs where components try to access reviews before provider is mounted
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  // Return the context object (contains reviews state and all review functions)
  return context;
};
