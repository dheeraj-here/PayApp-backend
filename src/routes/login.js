const express = require('express');
const router = express.Router();
const Users = require('../models/User')
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const verifyToken = require('../middleware/verifyToken');

const secretKey = process.env.SECRET_KEY || 'Mytoken123';

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("Login data...", username, password);

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please provide username and password.' });
  }

  try {
    await loginSchema.parseAsync(req.body);
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid data', errors: err.errors });
  }

  // Check if the user exists
  const user = await Users.findOne({ "username": username});
  if (!user) {
    return res.status(401).json({ success: false, message: 'Incorrect username.' });
  }

  // Compare hashed password
  const passwordMatch = await bcrypt.compare(password, user.password);
  console.log(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ success: false, message: 'Incorrect password.' });
  }

  // Generate and send JWT token
  const token = jwt.sign({ userId: user._id, username: user.username, balance: user.balance }, secretKey);

  res.status(200).json({ success: true, message: 'Login successful!', user, token });
});

module.exports = router;
