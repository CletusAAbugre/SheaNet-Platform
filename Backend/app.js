require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/error');

const app = express();

// Database connection
connectDB();

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', require('./routes/api'));
app.use('/api/auth', require('./routes/auth'));

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const { errorHandler } = require('./middlewares/error');
//
// const app = express();
//
// // Async database connection
// const startServer = async () => {
//     try {
//         await connectDB();
//
//         // Middlewares
//         app.use(cors({
//             origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//             credentials: true
//         }));
//         app.use(express.json());
//         app.use(express.urlencoded({ extended: true }));
//
//         // Routes
//         app.use('/api', require('./Routes/api'));
//         app.use('/api/auth', require('./Routes/auth'));
//         app.use('/webhooks', require('./Routes/webhooks'));
//
//         // Error handling
//         app.use(errorHandler);
//
//         const PORT = process.env.PORT || 5000;
//         app.listen(PORT, () => {
//             console.log(`Server running on port ${PORT}`);
//         });
//
//     } catch (err) {
//         console.error('🚨 Server startup failed:', err);
//         process.exit(1);
//     }
// };
//
// // Start the application
// startServer();