const unzip = require('../utils/unZip')
const detectLanguage = require('../utils/langDetect')

exports.upload = async (req, res) => {
    try {
        //multer should populate req.file
        if(!req.file || !req.file.path) {
            return res.status(400).json({
                success: false,
                message: "No ZIP file provided"
            });
        }
        console.log('inside the repo controller');

        const zipPath = req.file.path;
        const originalname = req.file.originalname;
        const userId = req.user ? req.user._id : null;

        //1. unzip the file (return the extracted folder path)
        const extractedPath = await unzip(zipPath);

        //2. detect the language
        const languageStats = detectLanguage(extractedPath);

        //3. return results

        //quick reply so frontend knows upload succeeded and mind the path
        return res.status(200).json({
            success: true,
            message: "ZIP extracted and language detected (dev response)",
            extractedPath,
            languageStats,
            originalname,
            uploadedBy: userId
        });
    } catch( err ) {
        console.error('Uploaded controller error ', err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}