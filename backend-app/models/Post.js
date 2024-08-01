// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  excerpt: String,
  tags: [String],
  author: String,
  image: String,
  imageUrl: String,
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Referensi ke User
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
