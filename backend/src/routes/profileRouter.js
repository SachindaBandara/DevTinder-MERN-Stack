const express = require("express");
const { userAuth } = require("../middleware/auth");

const profileRouter = express.Router();

// GET Profile API
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

module.exports = profileRouter;
