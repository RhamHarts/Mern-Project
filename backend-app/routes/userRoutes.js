const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  followUser, 
  unfollowUser, 
  getFollowers, 
  getFollowing,
  getProfileWithFollowStatus,
  getCurrentUserTotalLikes,
  getTotalLikes,
  getCurrentUserFollowersAndFollowing,
  getUserFollowersAndFollowing
} = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Route untuk register user
router.post('/register', registerUser);

// Route untuk login user
router.post('/login', loginUser);

// Route untuk follow user
router.post('/follow/:id', authMiddleware.verifyToken, followUser);

// Route untuk unfollow user
router.delete('/unfollow/:id', authMiddleware.verifyToken, unfollowUser);

// Route untuk mendapatkan data followers
router.get('/:id/followers', authMiddleware.verifyToken,getFollowers);

// Route untuk mendapatkan data following
router.get('/:id/following', authMiddleware.verifyToken,getFollowing);

// Route untuk mengambil profil dan postingan berdasarkan author
router.get('/follow-status/:id', authMiddleware.verifyToken, getProfileWithFollowStatus);

// Route untuk mendapatkan jumlah followers dan following dari user yang sedang login
router.get('/followers-following', authMiddleware.verifyToken, getCurrentUserFollowersAndFollowing);

router.get('/likes', authMiddleware.verifyToken, getCurrentUserTotalLikes);

router.get('/likes/:id', authMiddleware.verifyToken, getTotalLikes);

// Route untuk mendapatkan followers dan following dari user lain berdasarkan ID
router.get('/followers-following/:id', authMiddleware.verifyToken, getUserFollowersAndFollowing);



module.exports = router;
