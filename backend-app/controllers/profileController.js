const Profile = require('../models/Profile'); // Mengimpor model Profile
const User = require('../models/User');
const Post = require('../models/Post');

// Definisi fungsi createOrUpdateProfile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { email, dateBirth, aboutMe } = req.body; // Ambil data dari body
    const userId = req.user.id;

    // Check if file is uploaded, but make it optional
    let imageProfile;
    if (req.file) {
      imageProfile = req.file.filename; // Jika ada file, simpan filenya
      console.log('Image uploaded: ', imageProfile);
    }

    // Check if profile already exists for the user
    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      // Update existing profile
      console.log('Existing profile found for user:', userId);
      
      // Update only if data is provided, otherwise keep existing values
      if (email) {
        console.log('Updating email to:', email);
        profile.email = email;
      }
      if (dateBirth) {
        console.log('Updating date of birth to:', dateBirth);
        profile.dateBirth = dateBirth;
      }
      if (aboutMe) {
        console.log('Updating aboutMe to:', aboutMe);
        profile.aboutMe = aboutMe;
      }

      // Only update imageProfile if a new file is uploaded
      if (imageProfile) {
        console.log('Updating imageProfile to:', imageProfile);
        profile.imageProfile = imageProfile;
      }

      await profile.save();
      console.log('Profile updated:', profile);
      return res.status(200).json({ success: true, profile });
    } else {
      // Create new profile with only the provided data
      console.log('Creating new profile for user:', userId);

      profile = new Profile({
        user: userId,
        email: email || '', // Default to empty string if not provided
        dateBirth: dateBirth || '', // Default to empty string if not provided
        aboutMe: aboutMe || '', // Default to empty string if not provided
        imageProfile: imageProfile || '', // Default to empty string if not provided
      });

      await profile.save();
      console.log('Profile created:', profile);
      return res.status(201).json({ success: true, profile });
    }
  } catch (error) {
    console.error('Error in createOrUpdateProfile:', error);
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

exports.getMyProfileWithPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const posts = await Post.find({ userId: userId });

    res.status(200).json({ 
      success: true, 
      user: { 
        username: user.username,  
        email: user.email,
        aboutMe: profile.aboutMe, // Sertakan aboutMe di response
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
        aboutMe: profile.aboutMe,
        imageProfile: profile.imageProfile, // Sertakan imageProfile di respons
      },
      posts
    });
  } catch (error) {
    console.error('Error fetching profile with posts by author:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
