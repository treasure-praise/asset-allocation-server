const asyncHandler = require("express-async-handler");
const transactions = require("../models/transactionsModel");
const fundManagers = require("../models/fundManagerModel");
const Rollovers = require("../models/rolloverModel");

const mongoose = require("mongoose");
const axios = require("axios");

const getRollovers = asyncHandler(async (req, res) => {
  const RolloverData = await Rollovers.find();
  res.status(200).json({
    success: true,
    data: RolloverData,
  });
});

const getRolloversOnTransactions = asyncHandler(async (req, res) => {
  try {
    console.log(req.params);

    console.log(
      "Looking for rollovers with transactionId:",
      req.params.transactionId
    );
    const transactionId = req.params.transactionId;
    const result = await Rollovers.find({ transactionId }); // Fix method name and argument
    console.log("Found rollovers:", result);

    res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(400).json({
      message: "failure",
      error: error.message,
    });
  }
});

const createRollovers = asyncHandler(async (req, res) => {
  try {
    console.log(req.params);
    const rollover = await Rollovers.create({
      date: req.body.date,
      rate: req.body.rate,
      maturityDate: req.body.maturityDate,
      transactionId: (req.body.transactionId = req.params.transactionId),
    });

    console.log("this is the rollover result:", rollover);

    res.status(200).json({
      data: rollover,
    });
  } catch (error) {
    res.status(400).json({
      message: "error occuresd",
    });
  }
});

module.exports = {
  getRollovers,
  createRollovers,
  getRolloversOnTransactions,
};
