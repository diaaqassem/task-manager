const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log(token);
    const decode = jwt.verify(token, "diaa200"); //store id for token
    console.log(decode);
    const user = await User.findOne({ _id: decode._id, tokens: token });
    console.log(user);
    if (!user) {
        throw new Error();
    } else {
      req.user = user; //for current user
      req.token = token;
      next();
    }
  } catch (e) {
    res.status(401).send({ msg: "Invalid Token" });
  }
};

module.exports = auth;