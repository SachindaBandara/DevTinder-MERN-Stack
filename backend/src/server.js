const express = require("express");
const dbConnection = require("./config/dbConnection");
const User = require("./models/User");
const { signUpValidation } = require("./utils/validation");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json()); // Convert JSON into JavaScript Object

app.post("/signup", async (req, res) => {
  try {
    // validation
    signUpValidation(req);

    // encryption / can not decrypt
    const { firstName, lastName, emailId, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    // Get the Data from the request body
    await user.save();
    res.send("User created Successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

//login API
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body; // Get the inserted data

    // Check the type of emailId is valid or not
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Creditials");
    }

    // Check whether user exsit in the database or not
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credintials");
    }

    // If the user exist in the database,
    // get the user's password and compare hashed and entered password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("Login Successfully!");
    } else {
      throw new Error("Invalid Credintials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err);
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
app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const data = req.body;

    // Add the PATCH API validation for updating data
    const ALLOWED_UPDATES = ["password", "age", "gender"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed!");
    }

    await User.findByIdAndUpdate(userId, data, { runValidators: true }); // option (object) -> returnDocument= "after"
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
