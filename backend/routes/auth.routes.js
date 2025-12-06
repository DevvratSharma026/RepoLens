const express = require('express');
const router = express.Router();

const {signup, login, verifyOtp} = require('../Controllers/auth.controller');
const { auth } = require('../middlewares/auth.middleware');
const {getMe} = require('../Controllers/auth.controller');


router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.get('/me', auth, getMe)

module.exports = router;