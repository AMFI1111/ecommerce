// Import useState for managing component state
import { useState } from 'react';
// Import Link for navigation and useNavigate for programmatic navigation
import { Link, useNavigate } from 'react-router-dom';
// Import auth context hook to access authentication functions
import { useAuth } from '../context/AuthContext';
// Import CSS styles for authentication pages
import './Auth.css';

// Login component - handles user authentication with form validation
const Login = () => {
  // State for form data - contains email and password fields
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // State for form validation errors
  const [errors, setErrors] = useState({});
  // State to track if login is currently processing
  const [isLoading, setIsLoading] = useState(false);
  // useNavigate hook for programmatic navigation after successful login
  const navigate = useNavigate();
  // Access login function from AuthContext
  const { login } = useAuth();

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

  // Form validation function - checks email and password fields
  // Returns true if form is valid, false otherwise
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'; // Regex for email validation
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    // Return true if no errors (form is valid)
    return Object.keys(newErrors).length === 0;
  };

  // Handler function for form submission
  // Validates form, calls login API, and navigates to home
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // Validate form before submission
    if (!validateForm()) {
      return; // Stop if form is invalid
    }

    setIsLoading(true); // Set loading state to true

    try {
      // Call login function from AuthContext with credentials
      await login({
        email: formData.email,
        password: formData.password
      });
      navigate('/'); // Navigate to home page after successful login
    } catch (error) {
      setErrors({ ...errors, email: error.message || 'Login failed' });
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Render the login form with email, password, and social login options
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account</p>

          {/* Login form with email and password fields */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {/* Form options - remember me and forgot password */}
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            {/* Submit button - disabled while loading */}
            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider between form and social login */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* Social login options */}
          <div className="social-login">
            <button className="social-btn google-btn">
              Continue with Google
            </button>
            <button className="social-btn facebook-btn">
              Continue with Facebook
            </button>
          </div>

          {/* Footer with signup link */}
          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
