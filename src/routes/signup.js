const express = require('express');
const router = express.Router();
const Users = require('../models/User');
const jwt = require('jsonwebtoken');
const {z} = require('zod');
const bcrypt = require('bcrypt');


const secretKey = "Mytoken123";

const userSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    balance: z.number().positive(),
    password: z.string().min(6),
  });

// Signup route
router.post('/signup', async (req, res) => {
    const { username, email, balance, password } = req.body;
    console.log('Recieved data...' ,username, email, typeof(balance), password);

    // Basic validation
    if (!username || !email || !balance || !password) {
        return res.status(400).json({ success:false, message: 'Please provide username, email, and password.' });
    }
    try{
        await userSchema.parse(req.body);
    }
    catch(err){
        return res.status(400).json({ success: false, message: 'Invalid data', errors: err.errors });
    }

    // Check if the email is already registered
    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered. Please use a different email.' });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new Users({ username, email,balance, password: hashPass });
    await newUser.save();

    const token = jwt.sign({ userId: newUser.id, username: newUser.username, balance: newUser.balance }, secretKey);

    res.status(201).json({ success:true, message: 'User registered successfully!', user: newUser, token });
});

module.exports = router;
