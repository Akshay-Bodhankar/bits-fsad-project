const userModel = require('./models/UsersModel');
const bcrypt = require('bcrypt');

async function insertLogin() {
    try {
        const password = await bcrypt.hash('123456', 10);
        const user = await userModel.findOne({ userName: "admin" });
        if (!user) {
            const newUser = new userModel({
                userName: 'admin',
                password: password,
                role: 'coordinator'
            });
            await newUser.save();
            logger.info("User created successfully");
        }
    }
    catch (error) {
        throw new Error("Error during inserting login: " + error);
    }
}
insertLogin()
    .then(() => {
        logger.info("Done");
    })
    .catch((error) => {
        logger.error("Error executing insert login function:", error);
    });