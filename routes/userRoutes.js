// This script defines routes for user registration and login

const express = require("express");
const {registerUser, loginUser} = require ("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;