const express = require('express');
const router = express.Router();
const { createOrUpdateProfile } = require('../controllers/profileController');
const { verifyToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { getProfileWithPosts } = require('../controllers/profileController');



// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/profile'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Route untuk membuat atau mengupdate profil pengguna
router.get('/profile', verifyToken, getProfileWithPosts);
router.post('/', verifyToken, upload.single('imageProfile'), createOrUpdateProfile);

module.exports = router;
