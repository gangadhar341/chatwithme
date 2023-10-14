const mongoose = require("mongoose");

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.db_connection_string, {
      useNewUrlParser: true,
    });
    console.log("DB connection successful...");
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}

module.exports = connectDB;
