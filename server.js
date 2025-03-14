// /*
// This script initialises express.js, connects to the database, loads routes,
// and start server.
// */
//
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");
const router = require("./routes/userRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

// API Route for Frontend Communication
app.get("/api/message", (req, res) => {
    res.json({message: "Hello from the backend!"});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./config/database");
// const router = require("./routes/userRoutes");
//
// dotenv.config();
// connectDB();
//
// const app = express();
// app.use(cors());
// app.use(express.json());
//
// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/products", require("./routes/productRoutes"));
//
// const PORT = process.env.PORT || 5000;
//
// // Only listen if this is the main entry point (not when it's imported in tests)
// if (require.main === module) {
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }
//
// module.exports = app;  // Export app for testing purposes
