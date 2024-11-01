const Post = require('../models/Post');
const Like = require('../models/Like')
const Bookmark = require('../models/Bookmark')
const User = require('../models/User')

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
    const post = await Post.findById(req.params.id).populate('likes').populate('bookmarks'); // Mengambil data likes dan bookmarks
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user.id; 
    const hasLiked = post.likes.some(like => like.userId.toString() === userId); // Mengecek apakah userId ada di likes
    const hasBookmarked = post.bookmarks.some(bookmark => bookmark.userId.toString() === userId); // Mengecek apakah userId ada di bookmarks

    const postWithStatus = {
      ...post.toObject(),
      isLiked: hasLiked,
      isBookmarked: hasBookmarked, // Tambahkan status bookmark
    };

    res.json(postWithStatus);
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
    const { postId } = req.params;
    const userId = req.user.id;

    // Periksa apakah user sudah like post ini
    const existingLike = await Like.findOne({ postId, userId });
    if (existingLike) {
      return res.status(400).json({ message: 'You already liked this post' });
    }

    // Buat like baru
    const like = new Like({ postId, userId });
    await like.save();

    // Temukan post yang akan di-like
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Tambahkan like ke post dan increment likesCount
    await Post.findByIdAndUpdate(
      postId,
      { $push: { likes: like._id }, $inc: { likesCount: 1 } },
      { new: true }
    );

    // Tambahkan 1 ke totalLikes milik user yang membuat post ini
    await User.findByIdAndUpdate(post.userId, { $inc: { totalLikes: 1 } });

    res.status(201).json({ message: 'Post liked successfully', like });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


const bookmarkPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Periksa apakah user sudah bookmark post ini
    const existingBookmark = await Bookmark.findOne({ postId, userId });
    if (existingBookmark) {
      return res.status(400).json({ message: 'You already bookmarked this post' });
    }

    // Buat bookmark baru
    const bookmark = new Bookmark({ postId, userId });
    await bookmark.save();

    // Tambahkan bookmark ke array bookmarks di post dan increment bookmarksCount
    await Post.findByIdAndUpdate(
      postId,
      { $push: { bookmarks: bookmark._id }, $inc: { bookmarksCount: 1 } }, // Increment bookmarksCount
      { new: true }
    );

    res.status(201).json({ message: 'Post bookmarked successfully', bookmark });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Cek apakah user sudah menyukai postingan ini
    const existingLike = await Like.findOne({ postId, userId });
    if (!existingLike) {
      return res.status(400).json({ message: 'You have not liked this post yet' });
    }

    // Hapus like dari database
    await Like.findByIdAndDelete(existingLike._id);

    // Kurangi jumlah like dari post dan totalLikes dari user
    const post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: existingLike._id }, $inc: { likesCount: -1 } }, // Kurangi likesCount
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Kurangi 1 dari totalLikes milik user yang memiliki post ini
    await User.findByIdAndUpdate(post.userId, { $inc: { totalLikes: -1 } });

    res.status(200).json({ message: 'Like removed successfully' });
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const unbookmarkPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Cek apakah user sudah melakukan bookmark pada postingan ini
    const existingBookmark = await Bookmark.findOne({ postId, userId });
    if (!existingBookmark) {
      return res.status(400).json({ message: 'You have not bookmark this post yet' });
    }

    // Hapus like dari database
    await Bookmark.findByIdAndDelete(existingBookmark._id);

    // Kurangi jumlah like dari post dan totalLikes dari user
    const post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { bookmark: existingBookmark._id }, $inc: { bookmarksCount: -1 } }, // Kurangi bookmark
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }


    res.status(200).json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Error unbookmark post:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getLikePostsByUser = async (req, res) => {
  try {
    const userId = req.user.id; // Pastikan userId diambil dari token autentikasi

    // Cari semua like yang dilakukan oleh user
    const likes = await Like.find({ userId }).populate('postId');

    // Dapatkan data postingan dari like tersebut
    const likedPosts = likes.map(like => like.postId);

    res.status(200).json({ likedPosts });
  } catch (error) {
    console.error('Error fetching liked posts:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getBookmarkPostsByUser = async (req, res) => {
  try {
    const userId = req.user.id; // Pastikan userId diambil dari token autentikasi

    // Cari semua bookmark yang dilakukan oleh user
    const bookmark = await Bookmark.find({ userId }).populate('postId');

    // Dapatkan data postingan dari like tersebut
    const bookmarkPosts = bookmark.map(bookmark => bookmark.postId);

    res.status(200).json({ bookmarkPosts });
  } catch (error) {
    console.error('Error fetching bookmark posts:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Temukan postingan berdasarkan ID
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Periksa apakah user yang sedang login adalah pemilik postingan
    if (post.userId.toString() !== userId) {
      return res.status(401).json({ message: 'Unauthorized to delete this post' });
    }

    // Kurangi totalLikes dari user yang memiliki postingan ini
    await User.findByIdAndUpdate(post.userId, { $inc: { totalLikes: -post.likesCount } });

    // Hapus semua likes yang terkait dengan postingan ini
    await Like.deleteMany({ postId: id });

    // Hapus semua bookmarks yang terkait dengan postingan ini
    await Bookmark.deleteMany({ postId: id });

    // Hapus postingan dari database
    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: 'Post and associated likes and bookmarks deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getRelatedPosts = async (req, res) => {
  try {
    const { id } = req.params; // ID dari postingan yang sedang dilihat
    const currentPost = await Post.findById(id);

    if (!currentPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Cari postingan terkait berdasarkan tag, judul, dan penulis
    const relatedPosts = await Post.find({
      _id: { $ne: id }, // Tidak termasuk postingan yang sedang dilihat
      $or: [
        { tags: { $in: currentPost.tags } }, // Tag yang sama
        { title: { $regex: currentPost.title, $options: 'i' } }, // Judul yang mirip
        { author: currentPost.author } // Penulis yang sama
      ]
    }).limit(3); // Batasi jumlah postingan terkait yang diambil

    res.status(200).json({ relatedPosts });
  } catch (error) {
    console.error('Error fetching related posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { getPosts, getPostById, createPost, updatePost,searchPost,likePost,unlikePost,bookmarkPost,unbookmarkPost,getLikePostsByUser,getBookmarkPostsByUser,deletePost,getRelatedPosts };
