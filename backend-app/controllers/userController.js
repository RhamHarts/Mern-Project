const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fungsi untuk follow user
 exports.followUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const userToFollow = await User.findById(req.params.id);

    if (!currentUser.following.includes(userToFollow._id)) {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
      await currentUser.save();
      await userToFollow.save();
      return res.status(200).json({ message: 'Followed successfully' });
    }
    res.status(400).json({ message: 'Already following' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Fungsi untuk unfollow user
exports.unfollowUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const userToUnfollow = await User.findById(req.params.id);

    if (currentUser.following.includes(userToUnfollow._id)) {
      currentUser.following = currentUser.following.filter(
        (id) => !id.equals(userToUnfollow._id)
      );
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => !id.equals(currentUser._id)
      );
      await currentUser.save();
      await userToUnfollow.save();
      return res.status(200).json({ message: 'Unfollowed successfully' });
    }
    res.status(400).json({ message: 'Not following this user' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Fungsi untuk mendapatkan followers dengan jumlahnya
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'id username');  // Populate hanya id dan username
    const followersCount = user.followers.length;  // Menghitung jumlah followers
    res.status(200).json({ 
      followers: user.followers, 
      followersCount  // Mengirimkan jumlah followers
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Fungsi untuk mendapatkan following dengan jumlahnya
exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('following', 'id username');  // Populate hanya id dan username
    const followingCount = user.following.length;  // Menghitung jumlah following
    res.status(200).json({ 
      following: user.following, 
      followingCount  // Mengirimkan jumlah following
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getProfileWithFollowStatus = async (req, res) => {
  try {
    const profileUser = await User.findById(req.params.id);
    const isFollowing = profileUser.followers.includes(req.user.id);
    
    res.status(200).json({
      isFollowing
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCurrentUserFollowersAndFollowing = async (req, res) => {
  try {
    // Mengambil data user berdasarkan id dari token yang sedang login
    const user = await User.findById(req.user.id)
      .populate('followers', 'id username')  // Populate untuk mendapatkan informasi followers
      .populate('following', 'id username'); // Populate untuk mendapatkan informasi following

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followersCount = user.followers.length; // Menghitung jumlah followers
    const followingCount = user.following.length; // Menghitung jumlah following

    res.status(200).json({
      followersCount,
      followingCount,
      followers: user.followers,  // Mengirimkan data followers
      following: user.following   // Mengirimkan data following
    });
  } catch (error) {
    console.error('Error fetching followers and following:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fungsi untuk mendapatkan followers dan following dari user lain berdasarkan ID
exports.getUserFollowersAndFollowing = async (req, res) => {
  try {
    // Mengambil data user berdasarkan id yang dikirim melalui parameter
    const user = await User.findById(req.params.id)
      .populate('followers', 'id username')  // Populate followers dengan hanya id dan username
      .populate('following', 'id username'); // Populate following dengan hanya id dan username

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followersCount = user.followers.length; // Menghitung jumlah followers
    const followingCount = user.following.length; // Menghitung jumlah following

    res.status(200).json({
      followersCount,      // Kirimkan jumlah followers
      followingCount,      // Kirimkan jumlah following
      followers: user.followers,  // Kirimkan data followers
      following: user.following   // Kirimkan data following
    });
  } catch (error) {
    console.error('Error fetching followers and following:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getCurrentUserTotalLikes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ totalLikes: user.totalLikes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error });
  }
};

exports.getTotalLikes = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ totalLikes: user.totalLikes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error });
  }
};