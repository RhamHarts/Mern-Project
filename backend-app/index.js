// server.js
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

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/posts', postRoutes);

app.use('/', userRoutes);

app.use('/profile', profileRoutes);



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
