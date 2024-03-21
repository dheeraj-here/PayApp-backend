const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    username: {  // Corrected field name from useName to username
        type: String,
        maxlength: 20,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        maxLength: 5
    }
});

module.exports = mongoose.model("Users", usersSchema);
