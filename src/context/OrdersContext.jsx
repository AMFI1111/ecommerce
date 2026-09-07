import { createContext, useContext, useState, useEffect } from 'react';
import { ordersAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await ordersAPI.getUserOrders();
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (orderData) => {
    try {
      const newOrder = await ordersAPI.create(orderData);
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const getUserOrders = () => {
    return orders;
  };

  const getOrderById = async (orderId) => {
    try {
      const order = await ordersAPI.getOrderById(orderId);
      return order;
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        getUserOrders,
        getOrderById,
        loading,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
