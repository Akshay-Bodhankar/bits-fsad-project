const mongoose = require("mongoose");

const users = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "coordinator",
        enum: ['coordinator', 'admin', 'student']
    }
});

module.exports = mongoose.model("Users", users);
