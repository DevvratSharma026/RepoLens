const express = require('express');
const auth = require('../middlewares/auth.middleware');
const { createReview } = require('../Controllers/review.controller');
const router = express.Router();

router.post('/create', auth, createReview);

module.exports = router;