const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  items: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  shippingAddress: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'Credit Card'
  },
  status: {
    type: DataTypes.ENUM('Processing', 'Shipped', 'Delivered', 'Cancelled'),
    defaultValue: 'Processing'
  }
}, {
  timestamps: false,
  tableName: 'orders'
});

module.exports = Order;
