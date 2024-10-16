const express = require('express');
const multer = require('multer');
const path = require('path');
const { getPosts, createPost, getPostById, updatePost, searchPost,likePost, bookmarkPost,unlikePost } = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/post'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Rute untuk pencarian postingan
router.get('/search', searchPost);

// Rute untuk mendapatkan semua postingan
router.get('/', getPosts);

// Rute untuk membuat postingan dengan middleware autentikasi dan upload file
router.post('/', authMiddleware.verifyToken, upload.single('image'), createPost);

// Rute untuk mendapatkan postingan berdasarkan ID
router.get('/:id', authMiddleware.verifyToken, getPostById);

// Rute untuk mengupdate postingan berdasarkan ID
router.put('/:id', authMiddleware.verifyToken, upload.single('image'), updatePost);

router.post('/:postId/like', authMiddleware.verifyToken, likePost);

router.post('/:postId/bookmark', authMiddleware.verifyToken, bookmarkPost);

router.post('/:postId/unlike', authMiddleware.verifyToken, unlikePost);


module.exports = router;
