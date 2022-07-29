const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../configs/config");
const User = require("../Models/Usermodel");
const blogSchema = require("../Models/Blogmodel");

// below function for creating password secure
const SecurePassword = async (password) => {
  try {
    const passwordHash = await bcryptjs.hash(password, 10);
    return passwordHash;
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
//  creating function for genrating token
const create_token = async function (id) {
  try {
    const token = await jwt.sign({ _id: id }, config.serect_jwt);
    return token;
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
// creating function for  check user profile
const checkprofile = async (_id) => {
  let UserId = await User.findById({ _id: _id });
  if (UserId) {
    return UserId;
  } else {
    return false;
  }
};
// //  creating function
// const checkprofileId = async (_id) => {
//   let UserprofileId = await blogSchema.findById({ _id: _id });
//   if (UserprofileId) {
//     return UserprofileId;
//   } else {
//     return false;
//   }
// };
module.exports = { SecurePassword, create_token, checkprofile };
