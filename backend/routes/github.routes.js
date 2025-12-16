const express = require('express');
const router = express.Router();

const auth  = require('../middlewares/auth.middleware');
const githubController = require('../Controllers/github.controller');

router.post('/snapshot', auth, githubController.createSnapshotFromGitHub);

module.exports = router;