const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Koneksi ke database MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file
app.use('/uploads/post', express.static(path.join(__dirname, '/uploads/post')));
app.use('/uploads/profile', express.static(path.join(__dirname, '/uploads/profile')));

// Routes
app.use('/posts', postRoutes);
app.use('/', userRoutes);
app.use('/profile', profileRoutes);




// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
