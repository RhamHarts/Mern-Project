// controllers/profileController.js
const Profile = require('../models/Profile');

exports.createOrUpdateProfile = async (req, res) => {
  const { author, email, dateBirth } = req.body;
  const userId = req.user.id;

  try {
    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      // Update profile
      profile.author = author || profile.author;
      profile.imageProfile = req.file ? req.file.path : profile.imageProfile;
      profile.email = email || profile.email;
      profile.dateBirth = dateBirth || profile.dateBirth;

      await profile.save();
      return res.status(200).json({ success: true, profile });
    }

    // Create new profile
    profile = new Profile({
      user: userId,
      author,
      imageProfile: req.file ? req.file.path : null,
      email,
      dateBirth
    });

    await profile.save();
    res.status(201).json({ success: true, profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};