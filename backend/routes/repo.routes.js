const express = require('express');
const auth  = require('../middlewares/auth.middleware');
const upload = require('../middlewares/fileUpload.middleware');
const repoController = require('../Controllers/repo.controller')
const router = express.Router();



router.post('/repo/upload', auth, upload.single('file'), repoController.upload)


//upload.single('file') -> calls the fileupload middleware, it tells where to store the file i.e. tmp/uploads, and what is the file type we accepts

//repoController.upload -> checks if we recieved the file or not

module.exports = router;