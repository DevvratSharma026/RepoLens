const express = require('express');
const auth = require('../middlewares/auth.middleware');
const { createReview, getReview, getDashboardStats, getUserReviews } = require('../Controllers/review.controller');
const router = express.Router();

router.post('/create', auth, createReview);
router.get('/dashboard/stats', auth, getDashboardStats);
router.get('/user', auth, getUserReviews);
router.get('/:id', auth, getReview)

module.exports = router;