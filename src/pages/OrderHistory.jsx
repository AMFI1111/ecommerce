import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import './OrderHistory.css';

const OrderHistory = () => {
  const { user } = useAuth();
  const { getUserOrders } = useOrders();

  if (!user) {
    return (
      <div className="order-history-page">
        <div className="not-logged-in">
          <h1>Please Sign In</h1>
          <p>You need to be logged in to view your order history.</p>
          <Link to="/login" className="login-link">Sign In</Link>
        </div>
      </div>
    );
  }

  const orders = getUserOrders(user.email);

  if (orders.length === 0) {
    return (
      <div className="order-history-page">
        <div className="no-orders">
          <h1>No Orders Yet</h1>
          <p>You haven't placed any orders yet. Start shopping to see your order history here.</p>
          <Link to="/products" className="shop-link">Start Shopping</Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  return (
    <div className="order-history-page">
      <div className="order-history-header">
        <h1>Order History</h1>
        <p>{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>Order #{order.id}</h3>
                <p className="order-date">{formatDate(order.date)}</p>
              </div>
              <div className="order-status">
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p className="item-price">${formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-total">
                <span>Total:</span>
                <span className="total-amount">${formatPrice(order.total)}</span>
              </div>
              <div className="order-shipping">
                <span>Shipping to:</span>
                <span>{order.address}, {order.city}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
