const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
