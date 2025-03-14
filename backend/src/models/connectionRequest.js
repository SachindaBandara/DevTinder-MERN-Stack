const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      eum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

// Arrange the data ascendic order => (Optimize the searching)
connectionRequestSchema.index({fromUserId: 1, toUserId: 1})

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // Check same userId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Can not send connection request yourself!");
  }
  next();
});

module.exports = mongoose.model("ConnectionRequest", ConnectionRequestSchema);
