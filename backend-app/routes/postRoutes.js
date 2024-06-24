const express = require('express');
const multer = require('multer');
const path = require('path');
const { getPosts, createPost, getPostById } = require('../controllers/postController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get('/', getPosts);
router.post('/', upload.single('image'), createPost);
router.get('/:id', getPostById); // Route untuk get post by id

module.exports = router;
