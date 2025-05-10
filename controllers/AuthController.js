const authService = require("../services/AuthService");

const login = async (req, res) => {
    await authService.login(req, res);
}

const getMe = async (req, res) => { 
    await authService.getMe(req, res);
}
module.exports = {
    login,
    getMe
};