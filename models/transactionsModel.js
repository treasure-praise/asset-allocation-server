const mongoose = require("mongoose");

const transactionsSchema = mongoose.Schema(
  {
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    date: {
      type: Date,
    },
    rate: {
      type: Number,
    },
    maturityDate: {
      type: Date,
    },
    fundManagers: {
      type: mongoose.Schema.ObjectId,
      ref: "fundManagers",
    },
    totalCap: {
      type: Number,
    },
    amount: {
      type: Number,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//static method to get Total Transaction on Fund Manager
// transactionsSchema.statics.getTotalTransaction = async function (
//   fundManagerId
// ) {
//   console.log("calculating total transactions");
//   const obj = await this.aggregate([
//     {
//       $match: { fundManagers: fundManagerId },
//     },
//     {
//       $group: {
//         _id: "$fundManager",
//         totalTransactions: { $sum: "$rate" }, //INSTEAD OF RATE, CREATE NEW FIELD IN SCHEMA FOR AMOUNT AND USE INSTEAD
//       },
//     },
//   ]);
//   console.log(obj);
//   // try {
//   //   await this.model("transactions").findByIdAndUpdate(transactionId, {
//   //     totalCap: obj.totalTransactions,
//   //   });
//   // } catch (error) {}
// };

// transactionsSchema.statics.getTotalTransaction = async function (id) {
//   console.log("calculating total transactions");
//   const obj = await this.aggregate([
//     {
//       $group: {
//         _id: id,
//         total: { $sum: "$rate" },
//       },
//     },
//   ]);
//   console.log(obj);
//   try {
//     await this.model("fundManagers").findByIdAndUpdate(
//       id,
//       {
//         total: obj[0].total,
//       },
//       { new: true, runValidators: true }
//     );
//   } catch (error) {
//     res.status(400).json({
//       message: "didn't quite work out",
//     });
//   }

//   // const obj = await this.aggregate([
//   //   {
//   //     $match: { fundManagers: fundManagerId },
//   //   },
//   //   {
//   //     $group: {
//   //       _id: "$fundManager",
//   //       totalTransactions: { $sum: "$rate" }, //INSTEAD OF RATE, CREATE NEW FIELD IN SCHEMA FOR AMOUNT AND USE INSTEAD
//   //     },
//   //   },
//   // ]);
//   // console.log(obj);
//   // try {
//   //   await this.model("transactions").findByIdAndUpdate(transactionId, {
//   //     totalCap: obj.totalTransactions,
//   //   });
//   // } catch (error) {}
// };

//call getTotalTransacations on a fundmanager after save
// transactionsSchema.post("save", function () {
//   this.constructor.getTotalTransaction(this.id);
// });

module.exports = mongoose.model("transactions", transactionsSchema);
