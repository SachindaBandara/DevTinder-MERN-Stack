const express = require("express");
const dbConnection = require("./config/dbConnection");
const User = require("./models/User");
const { signUpValidation } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");

const app = express();

app.use(express.json()); // Convert JSON into JavaScript Object
app.use(cookieParser());

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
 
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      // Add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Data(Date.now() + 8 * 3600000),
      });

      res.send("Login Successfully!");
    } else {
      throw new Error("Invalid Credintials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

// GET Profile API
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err);
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
