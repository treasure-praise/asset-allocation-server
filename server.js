const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");

connectDB();

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/fundmanager", require("./routes/fundManagersRoutes"));
app.use("/transactions", require("./routes/transactionRoutes"));
app.use("/total-cap", require("./routes/total-cap.routes"));
app.use("/activityLog", require("./routes/activityLog.routes"));
app.use("/rollover", require("./routes/rollover.routes"));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
