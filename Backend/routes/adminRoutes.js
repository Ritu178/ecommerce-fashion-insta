const express = require("express");
const router = express.Router();

const multer = require("multer");
const verifyToken = require("../middleware/auth");
const admin = require("../controllers/adminController");

// IMAGE UPLOAD
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ROUTES
router.post("/login", admin.login);

router.post("/add-product", verifyToken, upload.single("image"), admin.addProduct);
router.put("/update-product/:id", verifyToken, admin.updateProduct);
router.delete("/delete-product/:id", verifyToken, admin.deleteProduct);

module.exports = router;