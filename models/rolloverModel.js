const mongoose = require("mongoose");

const rolloverSchema = mongoose.Schema({
  date: {
    type: Date,
  },
  rate: {
    type: Number,
  },
  maturityDate: {
    type: Date,
  },
  transactionId: {
    type: mongoose.Schema.ObjectId,
    ref: "transactions",
  },
});

module.exports = mongoose.model("rollover", rolloverSchema);
