const mongoose = require("mongoose");
const envVars = require("./envVars");

async function setUpDB() {
  try {
    await mongoose.connect(`${envVars.db.url}student-vaccine-portal`).then(() => logger.info('MongoDB connected'))
      .catch((err) => { throw new Error(err) });;
    // logger.info("Connected to database");
  } catch (err) {
    logger.info("Error connecting to database ", err.message);
    throw new Error(err.message);
  }
}

module.exports = setUpDB;