const Profile = require('../models/Profile'); // Mengimpor model Profile
const User = require('../models/User');
const Post = require('../models/Post');

// Definisi fungsi createOrUpdateProfile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { username, email, bio, facebook, instagram, twitter, tiktok } = req.body;
    const userId = req.user.id;

    // Validasi data jika diperlukan
    if (!username || !email) {
      return res.status(400).json({ success: false, message: 'Username and email are required' });
    }

    let profile = await Profile.findOne({ user: userId });

    // Ambil nama file asli jika file diunggah, jika tidak pakai gambar profil sebelumnya
    const imageProfile = req.file ? req.file.originalname : profile ? profile.imageProfile : '';

    if (profile) {
      // Jika profil sudah ada, lakukan update
      profile.username = username || profile.username;
      profile.email = email || profile.email;
      profile.bio = bio || profile.bio;
      profile.facebook = facebook || profile.facebook;
      profile.instagram = instagram || profile.instagram;
      profile.twitter = twitter || profile.twitter;
      profile.tiktok = tiktok || profile.tiktok;
      profile.imageProfile = imageProfile;

      await profile.save();
      return res.status(200).json({ success: true, profile });
    } else {
      // Jika belum ada profil, buat baru
      profile = new Profile({
        user: userId,
        username,
        email,
        bio,
        facebook,
        instagram,
        twitter,
        tiktok,
        imageProfile,
      });

      await profile.save();
      return res.status(201).json({ success: true, profile });
    }
  } catch (error) {
    console.error('Error in createOrUpdateProfile:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateImageProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Mengambil ID pengguna dari autentikasi

    // Cari profil berdasarkan userId
    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Validasi apakah ada file yang diunggah
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    // Ambil nama file asli dari file yang diunggah
    const imageProfile = req.file.originalname;

    // Perbarui imageProfile dalam profil pengguna
    profile.imageProfile = imageProfile;

    // Simpan perubahan profil
    await profile.save();

    return res.status(200).json({ success: true, message: 'Profile image updated successfully', profile });
  } catch (error) {
    console.error('Error updating profile image:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
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

exports.getMyProfileWithPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');
    const profile = await Profile.findOne({ user: userId });
    const posts = await Post.find({ userId: userId });


    res.status(200).json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        bio: profile.bio,
        facebook: profile.facebook,
        instagram: profile.instagram,
        twitter: profile.twitter,
        tiktok: profile.tiktok,
        imageProfile: profile.imageProfile
      },
      posts
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


exports.getProfileWithPostsByAuthor = async (req, res) => {
  try {
    const { author } = req.params; // Mengambil parameter author dari URL

    // Cari user berdasarkan username (author)
    const user = await User.findOne({ username: author }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }

    // Cari profil berdasarkan userId dari user yang ditemukan
    const profile = await Profile.findOne({ user: user._id });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Cari semua postingan yang dibuat oleh user (author)
    const posts = await Post.find({ userId: user._id });

    // Kirimkan respons dengan data profil dan postingan
    res.status(200).json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        bio: profile.bio,
        imageProfile: profile.imageProfile, // Sertakan imageProfile di respons
        facebook: profile.facebook, // Sertakan Bio di response
        instagram: profile.instagram, // Sertakan Bio di response
        twitter: profile.twitter, // Sertakan Bio di response
        tiktok: profile.tiktok, // Sertakan Bio di response
        image: profile.imageProfile
      },
      posts
    });
  } catch (error) {
    console.error('Error fetching profile with posts by author:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
