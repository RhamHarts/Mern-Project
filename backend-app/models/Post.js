// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

  title: String,
  description: String,
  excerpt: String,
  tags: [String],
  image: String,
  imageUrl: String,
  date: { type: Date, default: Date.now },
  author: String,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;