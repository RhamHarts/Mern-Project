const express = require('express');
const multer = require('multer');
const path = require('path');
const { getPosts, createPost, getPostById, updatePost, searchPost,likePost, bookmarkPost,unlikePost,unbookmarkPost,getLikePostsByUser,getBookmarkPostsByUser,deletePost} = require('../controllers/postController');
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

router.delete('/:id', authMiddleware.verifyToken, deletePost);


router.post('/:postId/like', authMiddleware.verifyToken, likePost);

router.post('/:postId/bookmark', authMiddleware.verifyToken, bookmarkPost);

router.post('/:postId/unlike', authMiddleware.verifyToken, unlikePost);

router.post('/:postId/unbookmark', authMiddleware.verifyToken, unbookmarkPost);

// Route untuk mendapatkan postingan yang di-like oleh user yang sedang login
router.get('/post/likedpost', authMiddleware.verifyToken, getLikePostsByUser);

// Route untuk mendapatkan postingan yang di-like oleh user yang sedang login
router.get('/post/bookmarkpost', authMiddleware.verifyToken, getBookmarkPostsByUser);


router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  
  // Mengembalikan URL gambar yang telah di-upload
  res.json({ location: `http://localhost:3001/uploads/post/${req.file.filename}` });
});



module.exports = router;
