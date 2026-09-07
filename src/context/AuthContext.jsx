// Import React hooks needed for context and state management
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

// Create a context object - this is the "data storage" for authentication state
// Components will access this through the useAuth hook below
const AuthContext = createContext();

// AuthProvider is a React component that wraps the app to provide auth context to all children
// It accepts 'children' prop which represents all components inside the provider
export const AuthProvider = ({ children }) => {
  // user state: holds the current logged-in user object (null if not logged in)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect hook: runs once on component mount
  // Automatically checks if user is already logged in from previous session
  useEffect(() => {
    // Check if token exists in localStorage from previous session
    const token = localStorage.getItem('token');
    if (token) {
      // If token exists, fetch user profile from backend
      authAPI.getProfile()
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []); // Empty dependency array means this only runs once on mount

  // Function to log in a user
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Function to register a new user
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Function to log out a user
  // Removes token from localStorage and clears user state
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Function to update user information (e.g., profile changes)
  const updateUser = async (userData) => {
    try {
      const updatedUser = await authAPI.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  // Render the Context Provider with all auth data and functions available to children
  // The value prop contains everything child components can access via useAuth()
  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser, loading }}>
      {children} {/* Render all child components inside the provider */}
    </AuthContext.Provider>
  );
};

// Custom hook that components use to access auth context
// This is the convenience wrapper that makes it easy for components to get auth data
export const useAuth = () => {
  // Access the AuthContext using React's useContext hook
  const context = useContext(AuthContext);
  // Error handling: if hook is used outside AuthProvider, throw error
  // This prevents bugs where components try to access auth before provider is mounted
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // Return the context object (contains user state and all auth functions)
  return context;
};
