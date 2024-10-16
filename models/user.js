const mongoose = require("mongoose");
const validator = require("../node_modules/validator/validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// user schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(val) {
      console.log(val);
      if (!validator.isEmail(val)) {
        console.log(val);
        throw new Error("Invalid Email Address");
      }
    },
  },
  age: {
    type: Number,
    default: 18,
    validate(val) {
      if (val < 0 || val > 99) {
        throw new Error("Age must be between 0 and 99");
      }
    },
  },
  city: {
    type: String,
  },
  tokens: [
    {
      type: String,
      required: true,
    },
  ],
  // tasks: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Task",
  //   },
  // ],
  // username :String,
  // email :String,
  // password :String,
  // city :String,
  // age :Number,
});

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });
  // console.log(user);
  if (!user) {
    throw new Error("unable to login");
  }
  // console.log(user);
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    throw new Error("unable to login");
  }
  // console.log(user);
  return user;
};

// Defines a pre-save hook for the UserSchema model
UserSchema.pre("save", async function () {
  const user = this;
  // Check if password field has been modified
  if (user.isModified("password"))
    // Hash password using bcryptjs
    user.password = await bcryptjs.hash(user.password, 8);
});

// // bcrypt password
// UserSchema.pre("save", async function () {
//   const user = this;
//   // check modify
//   if (user.isModified("password"))
//     user.password = await bcryptjs.hash(user.password, 8);
// });
// handle schema db

// jwt
//method access doc
UserSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "diaa200");
  user.tokens = user.tokens.concat(token);
  await user.save();
  return token;
};

//hide private data
UserSchema.method("toJSON", function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  delete userObject.tokens;
  return userObject;
});

//virtual relation
UserSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
