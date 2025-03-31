// /*
// This script initialises express.js, connects to the database, loads Routes,
// and start server.
// */
//

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = require('./config/cors');
const errorHandler = require('./middleware/errorHandler');

// Routes
const productRoutes = require('./Routes/productRoutes');
const userRoutes = require('./Routes/userRoutes');
const cartRoutes = require('./Routes/cartRoutes');

const app = express();

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Error:', err));

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);

// Error handling (must be last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));