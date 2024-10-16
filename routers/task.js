const express = require("express");
const Task = require("../models/task");
// const { findByIdAndDelete } = require("../models/user");
const auth = require("../middlewar/auth");
const User = require("../models/user");
const router = express.Router();

router.post("/tasks", auth, async (req, res) => {
  // console.log(req.body);
  try {
    const task = new Task({ ...req.body, owner: req.user._id });
    await task.save();
    //   console.log(task);
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    // const tasks = await Task.find({ owner: req.user.username }).sort({ date
    //     : -1
    //     })
    // const tasks = await Task.find({ owner: req.user._id });
    // @desc  vertual relation
    await req.user.populate("tasks");
    // res.status(200).send(tasks);
    res.status(200).send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id; // id for task
  try {
    // const task = await Task.findById(_id);
    const task = await Task.findOne({ _id: _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send("not found!!");
    }
    // relation populate
    await task.populate("owner"); //owner data
    // const user = await User.findOne({ _id: task.owner });
    //Ensure the user is the owner of the task
    // if (task.owner.toString() !== req.user._id.toString())
    //   return res.status(403).send("User is not authorized");
    res.status(200).json({ task });
  } catch (e) {
    res.status(400).send(e);
  }
});

//update a specific task by its id
router.patch("/tasks/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findOneAndUpdate(
      { _id: _id, owner: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).send("No task with this ID");
    }
    res.send(task);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err);
  }
});

//delete
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findOneAndDelete({ _id: _id, owner: req.user._id });
    if (!task) {
      return res.status(400).send("no such task");
    }
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
