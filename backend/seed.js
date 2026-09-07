require('dotenv').config();
const sequelize = require('./config/database');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const Wishlist = require('./models/Wishlist');
const Review = require('./models/Review');
const Order = require('./models/Order');

const products = [
  {
    name: "Wireless Headphones",
    price: 79.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop"
    ],
    description: "High-quality wireless headphones with noise cancellation and 20-hour battery life.",
    rating: 4.5,
    stock: 15
  },
  {
    name: "Smart Watch",
    price: 199.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-15795863372722-6a29f3c0e3c6?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop"
    ],
    description: "Feature-rich smartwatch with fitness tracking, heart rate monitor, and GPS.",
    rating: 4.8,
    stock: 8
  },
  {
    name: "Laptop Backpack",
    price: 49.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop&auto=format&h=800",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop&auto=format&q=80"
    ],
    description: "Durable laptop backpack with padded compartment, USB charging port, and multiple pockets.",
    rating: 4.3,
    stock: 25
  },
  {
    name: "Running Shoes",
    price: 89.99,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop"
    ],
    description: "Comfortable running shoes with breathable mesh and cushioned sole for maximum comfort.",
    rating: 4.6,
    stock: 12
  },
  {
    name: "Mechanical Keyboard",
    price: 129.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop"
    ],
    description: "RGB mechanical keyboard with cherry MX switches and programmable keys.",
    rating: 4.7,
    stock: 10
  },
  {
    name: "Denim Jacket",
    price: 69.99,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&h=800&fit=crop&auto=format&q=80"
    ],
    description: "Classic denim jacket with a modern fit, perfect for casual wear.",
    rating: 4.4,
    stock: 18
  },
  {
    name: "Wireless Mouse",
    price: 29.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop&auto=format&h=800"
    ],
    description: "Ergonomic wireless mouse with precision tracking and long battery life.",
    rating: 4.2,
    stock: 30
  },
  {
    name: "Sunglasses",
    price: 39.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop&auto=format&q=80"
    ],
    description: "Stylish polarized sunglasses with UV protection and lightweight frame.",
    rating: 4.5,
    stock: 22
  },
  {
    name: "Coffee Maker",
    price: 59.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-151766880882212-9ebb02f2a0e6?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-151766880882212-9ebb02f2a0e6?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-151766880882212-9ebb02f2a0e6?w=800&h=800&fit=crop&auto=format&q=80"
    ],
    description: "Programmable coffee maker with thermal carafe and auto-shutoff feature.",
    rating: 4.6,
    stock: 14
  },
  {
    name: "Plant Pot Set",
    price: 24.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=800&fit=crop&auto=format&q=80"
    ],
    description: "Set of 3 ceramic plant pots with drainage holes, perfect for indoor plants.",
    rating: 4.8,
    stock: 20
  },
  {
    name: "Yoga Mat",
    price: 34.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop&auto=format&q=80"
    ],
    description: "Extra thick yoga mat with non-slip surface and carrying strap.",
    rating: 4.4,
    stock: 16
  },
  {
    name: "Portable Speaker",
    price: 59.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop&auto=format&q=80"
    ],
    description: "Waterproof Bluetooth speaker with 12-hour battery and excellent sound quality.",
    rating: 4.7,
    stock: 9
  }
];

sequelize.sync({ force: true })
  .then(async () => {
    console.log('Connected to PostgreSQL and synced database (dropped and recreated tables)');
    
    // Insert new products
    await Product.bulkCreate(products);
    console.log('Products seeded successfully');
    
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });
