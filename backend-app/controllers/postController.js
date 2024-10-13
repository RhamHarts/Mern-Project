const Post = require('../models/Post');
const User = require('../models/User');

const getPosts = async (req, res) => {
  try {
    // Ambil batas jumlah post dari query params
    const limit = parseInt(req.query.limit) || 6;

    // Cari postingan dengan limit dan sort berdasarkan tanggal terbaru (createdAt)
    const posts = await Post.find()
      .sort({ date: -1 }) // Urutkan berdasarkan tanggal terbaru
      .limit(limit);

    // Hitung total jumlah post untuk pagination (masih bisa digunakan untuk keperluan lain)
    const totalPosts = await Post.countDocuments();

    // Kirimkan data post beserta total jumlah post
    res.status(200).json({ posts, totalPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};



const getPostById = async (req, res) => {
  try {
    // Step 1: Find the post by ID
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Step 2: Check if the current user has liked the post
    const userId = req.user.id; // Assuming req.user contains the authenticated user
    const hasLiked = post.likes.includes(userId); // Check if userId is in the likes array

    // Step 3: Add hasLiked information to the post object
    const postWithLikeStatus = {
      ...post.toObject(), // Convert mongoose document to a plain object
      isLiked: hasLiked, // Add the isLiked field
    };

    // Step 4: Send the post with the like status to the client
    res.json(postWithLikeStatus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const createPost = async (req, res) => {
  try {

    const { title, description, excerpt, tags, date, imageUrl } = req.body;
    const userId = req.user.id; // Mengambil userId dari req.user
    const username = req.user.username; // Mengambil username dari req.user

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    let imageFile = null;
    if (imageUrl && imageUrl.startsWith('http')) {
      imageFile = null;
    } else if (req.file) {
      imageFile = req.file.filename;
    }

    const newPost = new Post({
      title,
      description,
      excerpt,
      author: username, // Pastikan ini terisi dengan username dari req.user
      tags: tags.split(',').map((tag) => tag.trim()),
      date,
      image: imageFile,
      imageUrl: imageUrl || null,
      userId: userId, // Menyimpan userId di post
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};


const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, excerpt, tags, date, imageUrl } = req.body;
    const userId = req.user.id;

    // Temukan postingan berdasarkan ID
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Periksa apakah user yang sedang login adalah pemilik postingan
    if (post.userId.toString() !== userId) {
      return res.status(401).json({ message: 'Unauthorized to update this post' });
    }

    console.log('Request body:', req.body);
    console.log('Existing post:', post);

    // Update postingan dengan nilai baru dari body
    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (tags !== undefined) post.tags = tags.split(',').map((tag) => tag.trim());
    if (date !== undefined) post.date = date;

    // Periksa dan atur nilai image dan imageUrl
    if (imageUrl) {
      post.image = null; // Hapus image jika imageUrl ada
      post.imageUrl = imageUrl;
    }

    if (req.file) {
      post.image = req.file.filename;
      post.imageUrl = null; // Hapus imageUrl jika file diupload
    }

    console.log('Updated post:', post);

    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error); // Tambahkan log error untuk debugging
    res.status(500).json({ message: error.message });
  }
};

const searchPost = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Query parameter "q" is required' });
    }

    // Lakukan pencarian pada title, author, description, dan tags
    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    }).sort({ title: 1 }); // Mengurutkan berdasarkan title secara ascending

    res.json({ posts });
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user.id;
    const authorId = post.userId;

    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      post.likes = post.likes.filter(id => id !== userId);
      post.likesCount = Math.max(post.likesCount - 1, 0);
      user.totalLikes = Math.max(user.totalLikes - 1, 0); // Reduce total likes
    } else {
      post.likes.push(userId);
      post.likesCount += 1;
      user.totalLikes += 1; // Increase total likes
    }

    await post.save();
    await user.save();

    res.status(200).json({
      message: hasLiked ? 'Post unliked' : 'Post liked',
      likesCount: post.likesCount,
      totalLikes: user.totalLikes // Return total likes for user
    });
  } catch (error) {
    console.error('Error processing like/unlike:', error); // Tambahkan log error di sini
    res.status(500).json({ message: 'Error processing request', error });
  }
};


const bookmarkPost = async (req, res) => {
  try {
    // Step 1: Find the post by ID
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Step 2: Check if the user has already bookmarkd the post
    const userId = req.user.id;  // Assuming req.user contains the authenticated user
    const hasbookmarked = post.bookmarks.includes(userId);

    if (hasbookmarked) {
      // Step 3a: If already bookmarkd, unbookmark the post
      post.bookmarks = post.bookmarks.filter(id => id !== userId);  // Remove userId from bookmarks array
      post.bookmarksCount = Math.max(post.bookmarksCount - 1, 0);   // Decrease bookmarksCount, but not below 0
    } else {
      // Step 3b: If not bookmarkd yet, bookmark the post
      post.bookmarks.push(userId);  // Add userId to bookmarks array
      post.bookmarksCount += 1;     // Increase bookmarksCount
    }

    // Step 4: Save the updated post to the database
    await post.save();

    // Step 5: Send back the updated post and the bookmark/unbookmark message
    res.status(200).json({ message: hasbookmarked ? 'Post unbookmarked' : 'Post bookmarked', post });

  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error });
  }
};






module.exports = { getPosts, getPostById, createPost, updatePost,searchPost,likePost,bookmarkPost };
