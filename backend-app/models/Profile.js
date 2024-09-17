// models/Profile.js
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  email: {
    type: String,
  },
  dateBirth: {
    type: Date,
  },
  imageProfile: {
    type: String,
  },
  aboutMe: {
    type: String, // Deskripsi personal user
  },
});

module.exports = mongoose.model('Profile', ProfileSchema);
