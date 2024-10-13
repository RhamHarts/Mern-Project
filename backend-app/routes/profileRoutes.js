const express = require('express');
const router = express.Router();
const { 
    createOrUpdateProfile, 
    getProfile, 
    getMyProfileWithPosts, 
    getAllProfiles, 
    getUserProfile, 
    getProfileWithPostsById,  
    updateImageProfile,
} = require('../controllers/profileController');
const  authMiddleware  = require('../middleware/auth');
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
router.get('/',authMiddleware.verifyToken, async (req, res) => {
    try {
        await getUserProfile(req, res);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route untuk mengambil semua profil pengguna
router.get('/all', authMiddleware.verifyToken, getAllProfiles);

// Route untuk mengambil profil pengguna yang ada
router.get('/now', authMiddleware.verifyToken, getProfile);

// Route untuk mengambil profil pengguna beserta postingannya
router.get('/posts', authMiddleware.verifyToken, getMyProfileWithPosts);

// Route untuk membuat atau mengupdate profil pengguna
router.post('/create', authMiddleware.verifyToken,createOrUpdateProfile);

router.post('/image', authMiddleware.verifyToken, upload.single('imageProfile'), updateImageProfile);

// Route untuk mengambil profil dan postingan berdasarkan id
router.get('/posts/:id', authMiddleware.verifyToken, getProfileWithPostsById);



module.exports = router;
