const multer = require('multer');
const path = require('path');

//store uploaded zip files temp
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "tmp/uploads");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

//accepts only zip files
function fileFilter (req, file, cb) {
    const ext = path.extname(file.originalname).toLocaleLowerCase();
    if(ext !== ".zip") {
        return cb(new Error("only .zip files are allowed"), false);
    }
    cb(null, true);
}

const upload = multer({
    storage,
    fileFilter, 
    limits: {fieldSize: 20 * 1024* 1024}
});

module.exports = upload;