const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

// GET Profile API
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

profileRouter.post("/profile/edit", userAuth, async(req, res) => {
  try {
    if (!validateEditProfileData(req)){
      throw new Error("Invalid Edit Request!")
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    loggedInUser.save();

    res.send(`${loggedInUser.firstName},  your profile updated successfully!`)

  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
})

module.exports = profileRouter;
