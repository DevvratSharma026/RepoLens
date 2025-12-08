exports.upload = async (req, res) => {
    try {
        //multer should populate req.file
        if(!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file provided"
            })
        }
        //quick reply so frontend knows upload succeeded and mind the path
        return res.status(200).json({
            success: true,
            message: "ZIP received",
            tempZipPath: req.file.path,
            originalname: req.file.originalname
        });
    } catch( err ) {
        console.error('Uploaded controller error ', err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}