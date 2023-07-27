const express = require("express");
const router = express.Router();
const {
  createTransactionOnFundManager,
  getTransactionsOnFundManager,
  updateTransactions,
  getSingleTransaction,
  getRolloversOnTransactions,
} = require("../controllers/transactionsController");

router.post("/:id", createTransactionOnFundManager);
router.get("/", getTransactionsOnFundManager);
router.get("/:transactionId", getSingleTransaction);
router.put("/:transactionId", updateTransactions);
// router.get("/:transactionId/:transactionId", getRolloversOnTransactions);

module.exports = router;
