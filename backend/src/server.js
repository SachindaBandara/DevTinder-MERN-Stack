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

// Get specific user
app.get("/user", async (req, res) => {
  try {
    const userId = req.body.emailId;
    const emailId = await User.find({ emailId: userId });

    if (emailId != 0) {
      res.send(emailId);
    } else {
      res.send("There is no any email");
    }
  } catch (err) {
    res.status(400).send("Somthing went wrong" + err.message);
  }
});

// Get one user
app.get("/one-user", async (req, res) => {
  try {
    const oneUser = await User.findOne();

    if (!oneUser) {
      res.status(400).send("There is no any user");
    } else {
      res.send(oneUser);
    }
  } catch (err) {
    res.res.status(400).send("Something went wrong" + err.message);
  }
});

// Get All users - feed API
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (err) {
    res.status(400).send("Somthing went wrong!");
  }
});

// Delete user
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete(userId);
    res.send("Deleted Successfully!");
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

// Update user deatails
app.patch("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const data = req.body;

    await User.findByIdAndUpdate(userId, data, {runValidators: true}); // option (object) -> returnDocument= "after"
    res.send("successfully updated");
  } catch (err) {
    res.status(400).send("Something Went Wrong!");
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
