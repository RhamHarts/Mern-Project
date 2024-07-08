// models/Profile.js
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  author: {
    type: String,
    required: true
  },
  imageProfile: {
    type: String
  },
  imageProfile2: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  dateBirth: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Profile', ProfileSchema);
