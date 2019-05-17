const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const id = Math.floor(Math.random() * 100000);
    const file_id = id.toString() + "." + file.originalname.split(".").pop();
    cb(null, file_id);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20000000 }
});

module.exports = upload;
