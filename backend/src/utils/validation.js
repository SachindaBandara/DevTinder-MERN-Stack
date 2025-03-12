const validator = require("validator");

const signUpValidation = (req) => {
  const { firstName, lastName, password, emailId } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Insert correct name!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Create a strong password!");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFeilds = ["firstName", "lastName", "age", "gender"];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFeilds.includes(field)
  );

  return isEditAllowed;
};

module.exports = { signUpValidation, validateEditProfileData };
