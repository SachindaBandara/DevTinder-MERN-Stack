const express = require("express");
const { signUpValidation } = require("../utils/validation");
const User = require("../models/User");
const validator = require("validator");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

//SignUp API
authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/login", async (req, res) => {
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
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
      });

      res.send("Login Successfully!");
    } else {
      throw new Error("Invalid Credintials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

//logout API
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logout Successfully!");
});

module.exports = authRouter;
