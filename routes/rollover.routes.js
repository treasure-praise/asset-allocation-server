const express = require("express");
const router = express.Router();
const {
  getRollovers,
  createRollovers,
  testRoutes,
  getRolloversOnTransactions,
} = require("../controllers/rolloverController");

// ✅
// router.get("/", testRoutes);

router.post("/create/:transactionId", createRollovers);
router.get("/:transactionId", getRolloversOnTransactions);
router.get("/", getRollovers);

module.exports = router;
