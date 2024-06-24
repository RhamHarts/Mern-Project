// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, } = require('../controllers/profileController');
const { verifyToken } = require('../middleware/auth');
const multer = require('multer');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Route untuk membuat atau mengupdate profil pengguna
router.post('/profile', verifyToken, upload.single('imageProfile'), createOrUpdateProfile);


module.exports = router;
