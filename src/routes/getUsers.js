// server/routes/users.js
const express = require('express');
const router = express.Router();
const Users = require('../models/User')

// Sample user data


// Route to get all users
router.get('/getUsers', async (req, res) => {
  try {
    const id = req.headers.currentuser;
    console.log(id, 'id...');
    const users = await Users.find();
    const filterUser = users.filter(item => item._id != id);
    res.status(200).json({ success: true, data: filterUser });
  } catch (error) {
    console.error("Error fetching courses: ", error);
    res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
});

module.exports = router;
