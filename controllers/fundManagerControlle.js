const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const fundManagers = require("../models/fundManagerModel");
const transactionsModel = require("../models/transactionsModel");
const activityLogModel = require("../models/activityLogModel");
const ip = require("ip");

// ✅
const getFundManagers = asyncHandler(async (req, res) => {
  const assetManagers = await fundManagers.find();
  const totalCap = fundManagers.getTotalTransaction("648adce411a36c660b85cc6e");
  res.status(200).send({
    count: assetManagers.length,
    totalCap: totalCap,
    data: assetManagers,
  });
});

// ✅
const createFundManager = asyncHandler(async (req, res) => {
  try {
    const newFundManager = await fundManagers.create({
      name: req.body.name,
      description: req.body.description,
      total: req.body.total,
      image: req.body.image,
      transactions: req.body.transactions,
      link: req.body.link,
    });

    res.status(200).json({
      newFundManager,
    });
  } catch (error) {
    res.status(400).send({
      message: "failure",
      error: error,
    });
  }
});

// ✅
const getFundManager = asyncHandler(async (req, res) => {
  const assetManager = await fundManagers
    .findById(req.params.id)
    .populate("transaction");
  if (!assetManager) {
    return res.status(400).json({
      success: false,
    });
  }
  return res.status(200).send({
    message: `Fund Manager with Id: ${req.params.id}`,
    data: assetManager,
  });
});

// ✅
const updateFundManager = asyncHandler(async (req, res) => {
  const assetManager = await fundManagers.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!assetManager) {
    return res.status(400).json({
      success: false,
    });
  }
  res.status(200).send({
    message: `Updated Fund manager with Id: ${req.params.id}`,
    data: assetManager,
  });
});

// ✅
const deleteFundManger = asyncHandler(async (req, res) => {
  const assetManager = await fundManagers.findByIdAndDelete(req.params.id);
  if (!assetManager) {
    return res.status(400).json({
      success: false,
    });
  }
  res.status(200).send({
    message: `Deleted  Fund manager with Id: ${req.params.id}`,
    data: assetManager,
  });
});

module.exports = {
  getFundManagers,
  getFundManager,
  deleteFundManger,
  createFundManager,
  updateFundManager,
  // updateTransactions,
};
