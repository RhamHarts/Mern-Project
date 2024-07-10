const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, getProfile, getProfileWithPosts } = require('../controllers/profileController');
const { verifyToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/profile'));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  }
});

const upload = multer({ storage });

// Route untuk mengambil profil pengguna yang ada
router.get('/', verifyToken, getProfile);

// Route untuk mengambil profil pengguna beserta postingannya
router.get('/profile/posts', verifyToken, getProfileWithPosts);

// Route untuk membuat atau mengupdate profil pengguna
router.post('/', verifyToken, upload.single('imageProfile'), createOrUpdateProfile);

module.exports = router;
