const multer = require("multer");
// Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.upload = upload;
