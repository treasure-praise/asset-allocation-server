const express = require("express");
const router = express.Router();
const {
  getFundManagers,
  createFundManager,
  deleteFundManger,
  getFundManager,
  updateFundManager,
} = require("../controllers/fundManagerControlle");

router.get("/", getFundManagers);

router.post("/", createFundManager);

router.get("/:id", getFundManager);
router.put("/:id", updateFundManager);

router.delete("/:id", deleteFundManger);

module.exports = router;
