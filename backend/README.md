# E-Commerce Backend

A Node.js/Express backend with PostgreSQL for the e-commerce application.

## Features

- User authentication (register, login, profile management)
- Product management (CRUD operations)
- Shopping cart functionality
- Wishlist management
- Product reviews and ratings
- Order processing and history
- JWT-based authentication
- RESTful API design

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables (copy from `.env.example`):
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

4. Make sure PostgreSQL is running on your system and create the database:
```bash
# On Windows (using pgAdmin or psql)
psql -U postgres
CREATE DATABASE ecommerce;
\q

# On macOS/Linux
sudo systemctl start postgresql
sudo -u postgres psql
CREATE DATABASE ecommerce;
\q
```

## Database Setup

1. Seed the database with initial products:
```bash
node seed.js
```

This will populate the database with 12 sample products and create all necessary tables.

## Running the Server

### Development Mode
```bash
npm run dev
```
This will start the server with nodemon for auto-reloading on file changes.

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product by ID
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `DELETE /api/cart/remove/:productId` - Remove item from cart (protected)
- `PUT /api/cart/update/:productId` - Update item quantity (protected)
- `DELETE /api/cart/clear` - Clear cart (protected)

### Wishlist
- `GET /api/wishlist` - Get user's wishlist (protected)
- `POST /api/wishlist/add` - Add item to wishlist (protected)
- `DELETE /api/wishlist/remove/:productId` - Remove item from wishlist (protected)
- `GET /api/wishlist/check/:productId` - Check if item is in wishlist (protected)
- `DELETE /api/wishlist/clear` - Clear wishlist (protected)

### Reviews
- `GET /api/reviews/product/:productId` - Get reviews for a product
- `GET /api/reviews/rating/:productId` - Get average rating for a product
- `POST /api/reviews` - Add a review (protected)
- `GET /api/reviews/count/:productId` - Get review count for a product

### Orders
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get single order by ID (protected)
- `PUT /api/orders/:id/status` - Update order status (admin)

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Project Structure

```
backend/
├── config/           # Database configuration
│   └── database.js
├── models/           # Sequelize models
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   ├── Wishlist.js
│   ├── Review.js
│   └── Order.js
├── routes/           # API routes
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   ├── wishlist.js
│   ├── reviews.js
│   └── orders.js
├── middleware/       # Custom middleware
│   └── auth.js
├── server.js         # Main server file
├── seed.js          # Database seeding script
├── package.json
├── .env.example     # Environment variables template
└── .env             # Environment variables (create this)
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name (default: ecommerce)
- `DB_USER` - PostgreSQL username
- `DB_PASSWORD` - PostgreSQL password
- `JWT_SECRET` - Secret key for JWT token generation
- `NODE_ENV` - Environment (development/production)

## Security Notes

- Change the `JWT_SECRET` in production to a strong, random string
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints in production
- Add input validation and sanitization
- Use HTTPS in production
- Implement proper error handling and logging

## Troubleshooting

### PostgreSQL Connection Error
- Ensure PostgreSQL is running
- Check the database credentials in your `.env` file
- Verify the database `ecommerce` exists
- Verify PostgreSQL is accessible on the specified port

### Port Already in Use
- Change the `PORT` in your `.env` file
- Or stop the process using the port:
```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Module Not Found Errors
- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and `package-lock.json` and run `npm install` again

## Development

The backend uses:
- Express.js for the web framework
- Sequelize for PostgreSQL ORM
- pg for PostgreSQL client
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin resource sharing

## License

ISC
