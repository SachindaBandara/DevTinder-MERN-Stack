const express = require("express");
const dbConnection = require("./config/dbConnection");
const User = require("./models/User");

const app = express();

app.use(express.json()); // Convert JSON into JavaScript Object

app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body); // Get the Data from the request body
    await user.save();
    res.send("User created Successfully");
  } catch (err) {
    res.status(400).send(err);
  }
});

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
