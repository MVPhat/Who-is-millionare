const express = require("express");
const router = express.Router();
const path = require("path");

const { upload, uploadImages } = require("../services/upload.service");

router.post("/admin/upload-image", upload.single("image"), uploadImages);

router.get("/image/:filename", (req, res) => {
  const { filename } = req.params;
  const dirname = path.resolve();
  const fullFilePath = path.join(dirname, "uploads/images", filename);
  // console.log(fullFilePath);
  return res.sendFile(fullFilePath);
});

module.exports = router;
