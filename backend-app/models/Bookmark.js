const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
