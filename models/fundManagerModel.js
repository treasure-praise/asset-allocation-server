const mongoose = require("mongoose");

// const transitionsSchema = mongoose.Schema({
//   description: {
//     type: String,
//     maxlength: [500, "Description cannot be more than 500 characters"],
//   },
//   date: {
//     type: Date,
//   },
//   rate: {
//     type: Number,
//   },
//   maturityDate: {
//     type: Date,
//   },
// });

const fundManagersSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
    },
    image: {
      type: String,
      default:
        "https://resources.alleghenycounty.us/css/images/Default_No_Image_Available.png",
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Reverse Populate ith Virtuals
fundManagersSchema.virtual("transaction", {
  ref: "transactions",
  localField: "_id",
  foreignField: "fundManagers",
  justOne: false,
});

//static method to get Total Transaction on Fund Manager
// fundManagersSchema.statics.getTotalTransaction = async function (
//   transactionId
// ) {
//   console.log("calculating total transactions");
//   const obj = await this.aggregate([
//     {
//       $match: { transactions: transactionId },
//     },
//     {
//       $group: {
//         _id: "$transactions",
//         totalTransactions: { $sum: "$total" },
//       },
//     },
//   ]);
//   console.log(obj);
// };

fundManagersSchema.statics.getTotalTransaction = async function (id) {
  console.log("calculating total transactions on fund manager");
  const fundManagerId = new mongoose.Types.ObjectId(id);
  const obj = await this.aggregate([
    {
      $match: {
        fundManagers: fundManagerId,
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);
  console.log();
  try {
    await this.model("fundManagers").findByIdAndUpdate(
      id,
      {
        total: obj[0].totalAmount,
      },
      { new: true, runValidators: true }
    );
  } catch (error) {
    console.log("didnt quite work ");
  }

  // const obj = await this.aggregate([
  //   {
  //     $match: { fundManagers: fundManagerId },
  //   },
  //   {
  //     $group: {
  //       _id: "$fundManager",
  //       totalTransactions: { $sum: "$rate" }, //INSTEAD OF RATE, CREATE NEW FIELD IN SCHEMA FOR AMOUNT AND USE INSTEAD
  //     },
  //   },
  // ]);
  // console.log(obj);
  // try {
  //   await this.model("transactions").findByIdAndUpdate(transactionId, {
  //     totalCap: obj.totalTransactions,
  //   });
  // } catch (error) {}
};

//call getTotalTransacations on a fundmanager after save
// fundManagersSchema.pre("save", function () {
//   this.constructor.getTotalTransaction(this.id);
// });

module.exports = mongoose.model("fundManagers", fundManagersSchema);
