const express = require('express');
const router = express.Router();
const Users = require('../models/User')

// middleware to get userId
const getUserIdFromRoute = (req, res, next) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is missing in the route parameters" });
    }
    req.userId = userId;
    next();
};


//api to get userProfile
router.get('/profile/:userId', getUserIdFromRoute, async (req, res) => {
    try {
        const userId = req.userId;

        const user = await Users.findById(userId);

        if (user) {
            res.json({
                success: true,
                user: {
                    username: user.username,
                    email: user.email,
                    balance: user.balance,
                }
            })
        }
    }
    catch (err) {
        res.status(401).json({ success: false, message: "Failed getSingleUser api" })
    }
})

module.exports = router;
