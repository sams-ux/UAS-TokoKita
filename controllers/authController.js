const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db'); // koneksi db mysql

// Register user baru
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: 'Username and password are required' });

    // Cek user sudah ada atau belum
    const [existing] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0)
      return res.status(400).json({ message: 'Username already taken' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user ke DB
    await db.promise().query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: 'Username and password are required' });

    // Cari user berdasarkan username
    const [users] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0)
      return res.status(400).json({ message: 'Invalid username or password' });

    const user = users[0];

    // Cocokkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid username or password' });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
