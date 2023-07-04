const express = require("express");
const router = express.Router();
const Transaction = require("../models/transactionsModel");
const FundManager = require("../models/fundManagerModel");
const { default: mongoose } = require("mongoose");

router.get("/", (req, res) => {
  Transaction.aggregate([
    {
      $group: {
        _id: null,
        totalRate: { $sum: "$amount" },
      },
    },
  ])
    .then((result) => {
      if (result.length > 0) {
        const totalRate = result[0].totalRate;
        res.json({ totalRate });
      } else {
        res.json({ totalRate: 0 });
      }
    })
    .catch((error) => {
      console.error("Aggregation error:", error);
      res
        .status(500)
        .json({ error: "An error occurred while calculating the total rate." });
    });
});

router.get("/:fundManagerId", async (req, res) => {
  try {
    const fundManagerId = new mongoose.Types.ObjectId(req.params.fundManagerId);

    const result = await Transaction.aggregate([
      { $match: { fundManagers: fundManagerId } },
      {
        $group: {
          _id: null,
          totalRate: { $sum: "$amount" },
        },
      },
    ]);

    if (result.length > 0) {
      const totalRate = result[0].totalRate;

      const updatedFundManager = await FundManager.findByIdAndUpdate(
        fundManagerId,
        { total: totalRate },
        { new: true }
      );

      res.json({ totalRate, fundManager: updatedFundManager });
    } else {
      res.json({ totalRate: 0 });
    }
  } catch (error) {
    console.error("Aggregation or Fund Manager update error:", error);
    res.status(500).json({
      error:
        "An error occurred while calculating the total rate or updating the fund manager.",
    });
  }
});

//get top 5 by allocation size to get Exposure
router.get("/total/alloc-size", async (req, res) => {
  try {
    const fundManagers = await FundManager.aggregate([
      { $sort: { total: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, name: 1, total: 1 } },
    ]);

    // const fundManagers = await FundManager.find({})
    //   .select("name total")
    //   .sort({ total: 1 })
    //   .limit(5)
    //   .exec();
    res.json(fundManagers);
  } catch (error) {
    console.error("Aggregation error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while querying fund managers." });
  }
});

module.exports = router;
