const Post = require('../models/Post');

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, description, excerpt,  author, tags, date, imageUrl } = req.body;

    let imageFile = null;

    // Check if image is a URL or a file upload
    if (imageUrl && imageUrl.startsWith('http')) {
      // If image is a URL, use imageUrl field
      imageFile = null;
    } else if (req.file) {
      // If image is an uploaded file, use the filename
      imageFile = req.file.filename;
    }

    const newPost = new Post({
      title,
      description,
      excerpt,
      author,
      tags: tags.split(',').map((tag) => tag.trim()),
      date,
      image: imageFile,
      imageUrl: imageUrl || null, // Assign imageUrl if provided
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};




module.exports = { getPosts, getPostById, createPost };
