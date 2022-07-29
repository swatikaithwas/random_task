const jwt = require("jsonwebtoken");
// const { response } = require("../app");
const config = require("../configs/config");

const verfiyToken = async function (req, res, next) {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];
  if (!token) {
    res
      .status(200)
      .send({ success: false, mgs: "A token is required for authentication." });
  }
  try {
    const decodes = jwt.verify(token, config.serect_jwt);
    req.user = decodes;
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
  return next();
};
module.exports = verfiyToken;
