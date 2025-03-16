const express = require("express");
const dbConnection = require("./config/dbConnection");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");

const app = express();

app.use(express.json()); // Convert JSON into JavaScript Object
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

dbConnection()
  .then(() => {
    console.log("Connected Database Successfully");
    // PORT checking
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.log("Error in connecting database", err);
  });
