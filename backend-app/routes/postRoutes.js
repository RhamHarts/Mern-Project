const express = require('express');
const multer = require('multer');
const path = require('path');
const { getPosts, createPost, getPostById,updatePost } = require('../controllers/postController');
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

// Rute untuk mendapatkan semua postingan
router.get('/', getPosts);

// Rute untuk membuat postingan dengan middleware autentikasi dan upload file
router.post('/', authMiddleware.verifyToken, upload.single('image'), createPost);

// Rute untuk mendapatkan postingan berdasarkan ID
router.get('/:id', getPostById);

router.put('/:id', authMiddleware.verifyToken, upload.single('image'), updatePost);

module.exports = router;
