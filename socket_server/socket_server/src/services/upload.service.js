const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/images",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const uploadImages = async (req, res) => {
  res.send("file uploaded successfully");
};

module.exports = {
  upload,
  uploadImages,
};
