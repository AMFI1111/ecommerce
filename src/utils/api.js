const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getProfile: () => apiCall('/auth/profile'),
  
  updateProfile: (userData) => apiCall('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

// Products API
export const productsAPI = {
  getAll: () => apiCall('/products'),
  
  getById: (id) => apiCall(`/products/${id}`),
  
  getByCategory: (category) => apiCall(`/products/category/${category}`),
};

// Cart API
export const cartAPI = {
  get: () => apiCall('/cart'),
  
  add: (productId) => apiCall('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  }),
  
  remove: (productId) => apiCall(`/cart/remove/${productId}`, {
    method: 'DELETE',
  }),
  
  update: (productId, quantity) => apiCall(`/cart/update/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  }),
  
  clear: () => apiCall('/cart/clear', {
    method: 'DELETE',
  }),
};

// Wishlist API
export const wishlistAPI = {
  get: () => apiCall('/wishlist'),
  
  add: (productId) => apiCall('/wishlist/add', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  }),
  
  remove: (productId) => apiCall(`/wishlist/remove/${productId}`, {
    method: 'DELETE',
  }),
  
  check: (productId) => apiCall(`/wishlist/check/${productId}`),
  
  clear: () => apiCall('/wishlist/clear', {
    method: 'DELETE',
  }),
};

// Reviews API
export const reviewsAPI = {
  getProductReviews: (productId) => apiCall(`/reviews/product/${productId}`),
  
  getProductRating: (productId) => apiCall(`/reviews/rating/${productId}`),
  
  addReview: (reviewData) => apiCall('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),
  
  getReviewCount: (productId) => apiCall(`/reviews/count/${productId}`),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  getUserOrders: () => apiCall('/orders'),
  
  getOrderById: (id) => apiCall(`/orders/${id}`),
};
