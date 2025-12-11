const express = require('express');
const auth = require('../middlewares/auth.middleware');
const { createReview, getReview } = require('../Controllers/review.controller');
const router = express.Router();

router.post('/create', auth, createReview);
router.get('/:id', auth, getReview)

module.exports = router;