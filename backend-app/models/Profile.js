const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  username: { 
    type: String, 
    required: [true, 'Username is required'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    trim: true, 
    lowercase: true, 
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'] 
  },
  aboutMe: { 
    type: String, 
    default: '', 
    trim: true 
  },
  facebook: { 
    type: String, 
    default: '', 
    trim: true 
  },
  instagram: { 
    type: String, 
    default: '', 
    trim: true 
  },
  twitter: { 
    type: String, 
    default: '', 
    trim: true 
  },
  tiktok: { 
    type: String, 
    default: '', 
    trim: true 
  },
  imageProfile: { 
    type: String, 
    default: '', 
    trim: true 
  }
});

// Buat index untuk memastikan email dan username unik
ProfileSchema.index({ email: 1, username: 1 }, { unique: true });

module.exports = mongoose.model('Profile', ProfileSchema);
