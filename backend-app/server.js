const express = require('express');
const connectDB = require('./test/config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./test/models/User');
require('dotenv').config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Log incoming request body
    console.log('Register Request:', req.body);

    // Check if username already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = new User({ username, password: hashedPassword });

    // Save new user
    newUser.save();

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // Log error
    console.error('Error registering user:', error);
    
    // Respond with error message
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Log incoming request body
    console.log('Login Request:', req.body);

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Respond with token
    res.json({ token });
  } catch (error) {
    // Log error
    console.error('Error logging in user:', error);
    
    // Respond with error message
    res.status(500).json({ message: 'Server error' });
  }
});

// Test Endpoint
app.get('/', (req, res) => {
  res.send('Test endpoint berhasil');
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
