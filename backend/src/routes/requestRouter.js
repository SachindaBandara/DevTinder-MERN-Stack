const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/User");

const requestRouter = express.Router();

// Send connection request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // this request allow only ignored or interested then checking it
      const allowedRequest = ["ignored", "interested"];
      if (!allowedRequest.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }

      // Check user in database
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          message: "User is not found!",
        });
      }

      // check the connection request, whether it already exists or not
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const requestData = await connectionRequest.save();

      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        requestData,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

// Accept or Reject recieved connection request
const mongoose = require("mongoose");

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      // Validate status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }

      // Validate requestId
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ message: "Invalid request ID" });
      }

      // Find connection request
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id, // Ensure the logged-in user is the recipient
        status: "interested", 
      });


      if (!connectionRequest) {
        return res
          .status(404)
          .json({
            message: "Connection request not found or already processed!",
          });
      }

      // Ensure the logged-in user is authorized
      if (
        connectionRequest.toUserId.toString() !== loggedInUser._id.toString()
      ) {
        return res
          .status(403)
          .json({ message: "You are not authorized to update this request." });
      }

      // Update status
      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({
        message: `Connection Request ${status}`,
        data,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  }
);

module.exports = requestRouter;
