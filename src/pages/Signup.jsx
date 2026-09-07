// Import useState for managing component state
import { useState } from 'react';
// Import Link for navigation and useNavigate for programmatic navigation
import { Link, useNavigate } from 'react-router-dom';
// Import auth context hook to access authentication functions
import { useAuth } from '../context/AuthContext';
// Import CSS styles for authentication pages
import './Auth.css';

// Signup component - handles new user registration with form validation
const Signup = () => {
  // State for form data - contains all signup form fields
  // Each field stores what the user types in each input
  const [formData, setFormData] = useState({
    firstName: '',    // Stores user's first name
    lastName: '',     // Stores user's last name
    email: '',        // Stores user's email address
    password: '',     // Stores user's chosen password
    confirmPassword: '' // Stores password confirmation for validation
  });
  // State for form validation errors - stores error messages for each field
  // Empty object {} means no errors initially
  const [errors, setErrors] = useState({});
  // State to track if signup is currently processing
  // Used to show loading state and disable submit button during signup
  const [isLoading, setIsLoading] = useState(false);
  // useNavigate hook for programmatic navigation after successful signup
  // This lets us automatically redirect users after they create an account
  const navigate = useNavigate();
  // Access register function from AuthContext
  // After signup, we automatically log the user in
  const { register } = useAuth();

  // Handler function for form input changes
  // This runs whenever user types in any form field
  // Purpose: Update form data and clear error messages
  const handleChange = (e) => {
    const { name, value } = e.target; // Get which field changed and what was typed
    setFormData(prev => ({
      ...prev,           // Keep all existing form data
      [name]: value      // Update only the field that changed
    }));
    // Clear error message for this field when user starts typing
    // This gives immediate feedback that they're fixing the error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,           // Keep all other error messages
        [name]: ''         // Remove error for this specific field
      }));
    }
  };

  // Form validation function - checks all fields before allowing signup
  // Purpose: Ensure user entered valid data before creating account
  // Returns: true if form is valid, false if there are errors
  const validateForm = () => {
    const newErrors = {}; // Create empty object to store any validation errors

    // Validate first name - check if empty or only whitespace
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Validate last name - check if empty or only whitespace
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Validate email - check if empty and if format is correct
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'; // Regex checks for email pattern
    }

    // Validate password - check if empty and minimum length
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validate confirm password - check if empty and if it matches password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'; // Security check
    }

    setErrors(newErrors); // Update errors state with any validation errors found
    // Return true if no errors (form is valid), false if there are errors
    return Object.keys(newErrors).length === 0;
  };

  // Handler function for form submission
  // Purpose: Process the signup when user clicks Create Account button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submit
    
    // Validate form before processing signup
    if (!validateForm()) {
      return; // Stop here if form has errors
    }

    setIsLoading(true); // Show loading state - disables button and shows "Creating Account..."

    try {
      // Call register function from AuthContext with user data
      await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password
      });
      navigate('/'); // Redirect to home page after successful signup
    } catch (error) {
      setErrors({ ...errors, email: error.message || 'Signup failed' });
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  // Render the signup form with all input fields and validation
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Create Account</h1>
          <p className="auth-subtitle">Join us and start shopping</p>

          {/* Signup form - collects user information for account creation */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* First and Last Name - displayed in same row for better layout */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName} // Controlled input - value from state
                  onChange={handleChange} // Updates state when user types
                  className={errors.firstName ? 'error' : ''} // Adds error styling if validation fails
                  placeholder="John"
                />
                {/* Show error message only if firstName has an error */}
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'error' : ''}
                  placeholder="Doe"
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>

            {/* Email field - validates for proper email format */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="john@example.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Password field - must be at least 6 characters */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password" // Hides characters as user types
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="At least 6 characters"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {/* Confirm Password field - must match password field */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            {/* Terms agreement checkbox - required for signup */}
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" required /> {/* required attribute prevents signup without checking */}
                <span>I agree to the Terms of Service and Privacy Policy</span>
              </label>
            </div>

            {/* Submit button - disabled during loading to prevent double submission */}
            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={isLoading} // Disables button while processing signup
            >
              {isLoading ? 'Creating Account...' : 'Create Account'} 
            </button>
          </form>

          {/* Divider between form and social login options */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* Social login buttons - alternative signup methods */}
          <div className="social-login">
            <button className="social-btn google-btn">
              Sign up with Google
            </button>
            <button className="social-btn facebook-btn">
              Sign up with Facebook
            </button>
          </div>

          {/* Footer with link to login page for existing users */}
          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
