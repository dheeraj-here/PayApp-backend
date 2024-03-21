const express = require('express');
const router = express.Router();
const Users = require('../models/User');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose')

const secretKey = "Mytoken123";

// Signup route
router.put('/transferMoney', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { from, to, amount } = req.body;
    console.log(from, to, amount);

    try {
        const sender = await Users.findOne({ _id: from });
        const receiver = await Users.findOne({ _id: to });

        if (sender.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: "Insufficient balance" })
        }
        if (amount < 0) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: "Amount can't be in negative" })
        }

        await Users.updateOne({ _id: from }, { $inc: { balance: -amount } });
        await Users.updateOne({ _id: to }, { $inc: { balance: amount } })
        await session.commitTransaction();
        return res.json({ success: true, message: 'Money Transfered successful' });
    }
    catch (err) {
        await session.abortTransaction();
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }

});

module.exports = router;
