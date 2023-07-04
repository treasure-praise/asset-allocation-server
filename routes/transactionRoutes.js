const express = require("express");
const router = express.Router();
const {
  createTransactionOnFundManager,
  getTransactionsOnFundManager,
  updateTransactions,
  getSingleTransaction,
} = require("../controllers/transactionsController");

router.post("/:id", createTransactionOnFundManager);
router.get("/", getTransactionsOnFundManager);
router.get("/:transactionId", getSingleTransaction);
router.put("/:transactionId", updateTransactions);

module.exports = router;
