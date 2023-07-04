const mongoose = require("mongoose");

const activityLogSchema = mongoose.Schema({
  timestamp: Date,
  user: String, //Id of loggedin User
  action: String,
  details: Object,
});

module.exports = mongoose.model("activityLog", activityLogSchema);
