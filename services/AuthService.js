const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const userModel = require("../models/UsersModel");
const bcrypt = require('bcrypt');

const { v4: uuidv4 } = require("uuid");

const login = async (req, res) => {
    console.log("Inside login function");
    const { userName, password } = req.body;
    try {
        const user = await userModel.findOne({ userName: userName });
        if (!user) {
            return res.status(401).json({
                status: "error",
                statusCode: 401,
                message: "Invalid username or password"
            });
        }
        const isPsswordValid = await bcrypt.compare(password, user.password);
        if (!isPsswordValid) {
            return res.status(401).json({
                status: "error",
                statusCode: 401,
                message: "Invalid username or password"
            });
        }
        const token = jwt.sign({ userId: user._id, role: user.role, userName: user.userName }, jwtConfig.secret, {
            expiresIn: jwtConfig.jwt_expiretime,
        });
        res.json({
            status: "success",
            statusCode: 200,
            message: "Login successful",
            token
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: "Internal server error" + error
        });
    }
};

const getMe = async (req, res) => {
    console.log("Inside getMe function");
    res.json({ user: req.user });
};

module.exports = {
    login,
    getMe
};