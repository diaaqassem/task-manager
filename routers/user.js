const express = require("express");
const User = require("../models/user");
const router = express.Router();
// const jwt = require("jsonwebtoken");
const auth = require("../middlewar/auth");

router.post("/users", (req, res) => {
  // console.log(req.body);
  const user = new User(req.body);
  user
    .save()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// get users from db
router.get("/users", (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// get one user from db by id
router.get("/users/:id", auth, (req, res) => {
  console.log(req.params);
  const _id = req.params.id;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(404).send("user not found!!");
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// patch
router.patch("/users/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const updates = Object.keys(req.body); // return arr
    // const user = await User.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("user not found!!");
    }
    updates.forEach((ele) => {
      user[ele] = req.body[ele]; //الداتا الجديده هتروح تجيبها من الدات اللي بعدل عليها
    });
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// delete
router.delete("/users/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send("user not found!!");
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

//login

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateToken();
    res.status(200).send({ user, token });
    // console.log(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// jwt
router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    // const token = await user.generateToken();
    await user.save();
    res.status(200).send({ user: user, token: token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//profile
router.get("/profile", auth, async (req, res) => {
  try {
  const user = await User.findById(req.user._id);
  res.status(200).send(user);
  } catch (error){
    return res.status(500).send('server error');
    }
});

//logout
router.delete("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((el) => {
      return el != req.token; //delete current token
    });
    await req.user.save();
    res.send("Logged out");
  } catch (e) {
    res.status(500).send("Server Error");
  }
});

//logout all
router.delete("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
