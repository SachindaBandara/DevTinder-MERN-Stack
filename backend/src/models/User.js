const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 5,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Strong Password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  // Create JWT token for each user
  const token = await jwt.sign({ _id: user._id }, "Sachinda@19", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function ( inputPassword ) {
  const user = this;
  const hashPassword = user.password;

   // If the user exist in the database,
    // get the user's password and compare hashed and entered password
  const isPasswordValid = await bcrypt.compare(inputPassword, hashPassword);

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
