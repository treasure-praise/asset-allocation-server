const mongoose = require("mongoose");
const { fundManagersData } = require("../data/data");
require("dotenv").config({ path: "./config.env" });
const fundManagers = require("../models/fundManagerModel");
const user = require("../models/usersModel");
const Transactions = require("../models/transactionsModel");
const userData = require("../data/seed");
const transactions = require("../data/seed");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected ${conn.connection.host}`);
    // seeding Databases

    const seedDB = async () => {
      console.log("doings");
      await Transactions.deleteMany();
      await user.deleteMany();
      // await user.insertMany(userData);
      // await Transactions.insertMany(transactions);
    };

    // seedDB();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
