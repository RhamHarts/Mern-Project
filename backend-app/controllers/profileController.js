const Profile = require('../models/Profile'); // Mengimpor model Profile
const User = require('../models/User');
const Post = require('../models/Post');

// Definisi fungsi createOrUpdateProfile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { author, email, dateBirth } = req.body;
    const userId = req.user.id;

    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const imageProfile = req.file.filename;

    // Check if profile already exists for the user
    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      // Update existing profile
      profile.author = author || profile.author;
      profile.email = email || profile.email;
      profile.dateBirth = dateBirth || profile.dateBirth;
      profile.imageProfile = imageProfile;

      await profile.save();
      return res.status(200).json({ success: true, profile });
    } else {
      // Create new profile
      profile = new Profile({
        user: userId,
        author,
        email,
        dateBirth,
        imageProfile
      });

      await profile.save();
      return res.status(201).json({ success: true, profile });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Mengambil userId dari data autentikasi

    // Cari profil berdasarkan userId
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Jika profil ditemukan, kirimkan respons dengan profil
    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};




exports.getAllProfiles = async (req, res) => {
  try {
    // Ambil semua profil dari koleksi Profile
    const profiles = await Profile.find();

    // Jika profil ditemukan, kirimkan respons dengan profil
    res.status(200).json({ success: true, profiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getProfileWithPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user profile
    const user = await User.findById(userId).select('-password'); // Exclude password from response

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch posts by user
    const posts = await Post.find({ userId: userId });

    res.status(200).json({ success: true, user, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

