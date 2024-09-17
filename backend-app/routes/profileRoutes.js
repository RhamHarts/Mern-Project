const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, getProfile, getMyProfileWithPosts,getAllProfiles,getUserProfile,getProfileWithPostsByAuthor } = require('../controllers/profileController');
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

// Route for user profile
router.get('/', verifyToken, async (req, res) => {
  try {
    await getUserProfile(req, res);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/all', verifyToken, getAllProfiles);

// Route untuk mengambil profil pengguna yang ada
router.get('/now', verifyToken, getProfile);

// Route untuk mengambil profil pengguna beserta postingannya
router.get('/posts', verifyToken, getMyProfileWithPosts);

router.put('/update', verifyToken, upload.single('imageProfile'), createOrUpdateProfile);

// Route untuk membuat atau mengupdate profil pengguna
router.post('/create', verifyToken, upload.single('imageProfile'), createOrUpdateProfile);

// Route untuk mengambil profil dan postingan berdasarkan author
router.get('/posts/:author', verifyToken, getProfileWithPostsByAuthor);

module.exports = router;
