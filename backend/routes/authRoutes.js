const express = require('express');
const router = express.Router();
const { login, getProfile, register, forgotPassword, verifyOtp, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login',          login);
router.post('/register',       register);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp',     verifyOtp);
router.post('/reset-password', resetPassword);
router.get('/profile',         protect, getProfile);

module.exports = router;
