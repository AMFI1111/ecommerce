import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Account.css';

const Account = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  });
  const { getCartCount } = useCart();

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ')[1] || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        zipCode: user.zipCode || '',
        country: user.country || ''
      });
    }
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Update user data using AuthContext
    const updatedUser = {
      ...user,
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email,
      phone: editForm.phone,
      address: editForm.address,
      city: editForm.city,
      zipCode: editForm.zipCode,
      country: editForm.country,
      name: `${editForm.firstName} ${editForm.lastName}`
    };
    
    updateUser(updatedUser);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="account-page">
        <div className="account-container">
          <div className="not-logged-in">
            <h1>Please Sign In</h1>
            <p>You need to be logged in to view your account.</p>
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn primary">
                Sign In
              </Link>
              <Link to="/signup" className="auth-btn secondary">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="account-container">
        <div className="account-header">
          <h1>My Account</h1>
          <button onClick={handleLogout} className="logout-btn">
            Sign Out
          </button>
        </div>

        <div className="account-content">
          {/* Profile Section */}
          <div className="account-section">
            <div className="section-header">
              <h2>Profile Information</h2>
              {!isEditing && (
                <button onClick={handleEditToggle} className="edit-btn">
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editForm.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editForm.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-actions">
                  <button onClick={handleSave} className="save-btn">
                    Save Changes
                  </button>
                  <button onClick={handleEditToggle} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-info">
                <div className="info-item">
                  <span className="label">Name:</span>
                  <span className="value">{user.name || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Phone:</span>
                  <span className="value">{user.phone || 'Not set'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Address Section */}
          <div className="account-section">
            <div className="section-header">
              <h2>Shipping Address</h2>
              {!isEditing && (
                <button onClick={handleEditToggle} className="edit-btn">
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={editForm.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={editForm.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={editForm.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={editForm.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            ) : (
              <div className="address-info">
                {user.address ? (
                  <>
                    <div className="info-item">
                      <span className="label">Address:</span>
                      <span className="value">{user.address}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">City:</span>
                      <span className="value">{user.city || 'Not set'}</span>
                </div>
                    <div className="info-item">
                      <span className="label">Zip Code:</span>
                      <span className="value">{user.zipCode || 'Not set'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Country:</span>
                      <span className="value">{user.country || 'Not set'}</span>
                    </div>
                  </>
                ) : (
                  <p className="no-address">No address saved</p>
                )}
              </div>
            )}
          </div>

          {/* Quick Links Section */}
          <div className="account-section">
            <div className="section-header">
              <h2>Quick Links</h2>
            </div>
            <div className="quick-links">
              <Link to="/products" className="quick-link">
                <span>🛍️</span>
                <span>Browse Products</span>
              </Link>
              <Link to="/cart" className="quick-link">
                <span>🛒</span>
                <span>View Cart ({getCartCount()})</span>
              </Link>
              <Link to="/orders" className="quick-link">
                <span>📦</span>
                <span>View Orders</span>
              </Link>
              <Link to="/wishlist" className="quick-link">
                <span>❤️</span>
                <span>View Wishlist</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
