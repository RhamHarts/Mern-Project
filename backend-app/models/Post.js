const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  excerpt: { type: String, trim: true }, // Optional, bisa di-generate otomatis dari description
  tags: { type: [String], index: true }, // Menambahkan index untuk performa pencarian
  author: { type: String, required: true, trim: true }, // Ganti 'username' dengan 'author'
  image: { type: String, trim: true }, // Path ke image jika disimpan di server
  imageUrl: { type: String, trim: true }, // URL ke image jika di-hosting di luar
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Tetap gunakan userId untuk referensi user
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  likesCount: { type: Number, default: 0 }, // Tambahkan field ini
  bookmarksCount: { type: Number, default: 0 }, // Tambahkan field ini
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
