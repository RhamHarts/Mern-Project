const express = require('express');
const multer = require('multer');
const path = require('path');
const { getPosts, createPost, getPostById } = require('../controllers/postController');

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
router.get('/', getPosts);
router.post('/', upload.single('image'), createPost);
router.get('/:id', getPostById);

module.exports = router;
