const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  excerpt: { type: String, trim: true },
  tags: { type: [String], index: true },
  author: { type: String, required: true, trim: true },
  image: { type: String, trim: true },
  imageUrl: { type: String, trim: true },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like', default: [] }],
  likesCount: { type: Number, default: 0 },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bookmark', default: [] }], // Tambahkan array bookmarks
  bookmarksCount: { type: Number, default: 0 }, // Tambahkan field untuk menghitung bookmarks
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
