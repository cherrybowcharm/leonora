const express = require("express");
const router = express.Router();

const { register, login, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");
const {
  registerValidator,
  loginValidator,
} = require("../validators/auth.validator");

// POST /api/auth/register
router.post("/register", registerValidator, register);

// POST /api/auth/login
router.post("/login", loginValidator, login);

// GET /api/auth/me  (protected)
router.get("/me", protect, getMe);

module.exports = router;
