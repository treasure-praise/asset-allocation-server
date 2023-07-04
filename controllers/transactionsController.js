const asyncHandler = require("express-async-handler");
const transactions = require("../models/transactionsModel");
const fundManagers = require("../models/fundManagerModel");
const activityLog = require("../models/activityLogModel");
const requestIp = require("request-ip");
const mongoose = require("mongoose");
const axios = require("axios");

// ✅
const getTransactionsOnFundManager = asyncHandler(async (req, res) => {
  const Transactions = await transactions.find().populate({
    path: "fundManagers",
    select: "name",
  });
  res.status(200).send({
    data: Transactions,
  });
});

const createTransactionOnFundManager = asyncHandler(async (req, res) => {
  const transaction = await transactions.create({
    description: req.body.description,
    date: req.body.date,
    rate: req.body.rate,
    maturityDate: req.body.maturityDate,
    fundManagers: (req.body.fundManagers = req.params.id),
    amount: req.body.amount,
  });

  const formData = {
    reminder: req.body.description,
    years: 1,
    freq: 6,
    init_date: req.body.date,
  };

  createReminder(formData);

  const fundManagerId = new mongoose.Types.ObjectId(req.params.id);

  const result = await transactions.aggregate([
    { $match: { fundManagers: fundManagerId } },
    {
      $group: {
        _id: fundManagerId,
        totalRate: { $sum: "$amount" },
      },
    },
  ]);
  console.log(result);

  if (result.length > 0) {
    const totalRate = result[0].totalRate;

    const updatedFundManager = await fundManagers.findByIdAndUpdate(
      fundManagerId,
      { total: totalRate },
      { new: true }
    );

    res.json({ totalRate, fundManager: updatedFundManager, data: transaction });
  } else {
    res.json({ totalRate: 0 });
  }

  const log = await activityLog.create({
    timestamp: new Date(),
    user: "Maryam",
    action: `Created new Transaction on fundManager with Id(${fundManagerId}) `,
    details: {
      ipAddress: requestIp.getClientIp(req),
    },
  });
});

const updateTransactions = asyncHandler(async (req, res) => {
  try {
    console.log(req.params.transactionId);
    const transaction = await transactions.findByIdAndUpdate(
      req.params.transactionId,
      req.body,
      { new: true, runValidators: true }
    );
    console.log(transaction);
    await transaction.save();
    console.log(transaction);

    const fundManagerId = new mongoose.Types.ObjectId(req.params.id);

    const result = await transactions.aggregate([
      { $match: { fundManagers: fundManagerId } },
      {
        $group: {
          _id: fundManagerId,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    console.log(result);

    if (result.length > 0) {
      const totalAmount = result[0].totalAmount;

      const updatedFundManager = await fundManagers.findByIdAndUpdate(
        fundManagerId,
        { total: totalAmount },
        { new: true }
      );

      res.status(200).json({
        data: transaction,
        totalRate,
        fundManager: updatedFundManager,
      });
    } else {
      res.json({ totalRate: 0 });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

const getSingleTransaction = asyncHandler(async (req, res) => {
  const Transactions = await transactions.findById(req.params.transactionId);
  if (!Transactions) {
    return res.status(400).json({
      success: false,
    });
  }
  res.status(200).send({
    success: true,
    data: Transactions,
  });
});

const createReminder = async (formData) => {
  try {
    const response = await axios.post(
      "https://client.wealthparadigm.org/api/reminder",
      formData
    );
    console.log(response);
  } catch (error) {
    console.log(error.data);
  }
};

module.exports = {
  getTransactionsOnFundManager,
  createTransactionOnFundManager,
  updateTransactions,
  getSingleTransaction,
};
