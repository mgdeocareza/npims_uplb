const router = require("express").Router();
const mongoose = require("mongoose");
let NPIMSUser = require("../models/NPIMS_User.model");

// GET all users
router.route("/").get(async (req, res) => {
  try {
    const users = await NPIMSUser.find();
    res.json(users);
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
});

// GET user by ID
router.route("/:id").get(async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const user = await NPIMSUser.findById(id);
    if (!user) return res.status(404).json("User not found.");
    res.json(user);
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
});

// ADD new user
router.route("/add").post(async (req, res) => {
  try {
    const { username, department } = req.body;

    const newUser = new NPIMSUser({
      username,
      department: Array.isArray(department) ? department : [department],
      propertyCount: 0
    });

    await newUser.save();
    res.json("User added!");
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
});

// UPDATE user
router.route("/update/:id").post(async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const user = await NPIMSUser.findById(id);
    if (!user) return res.status(404).json("User not found.");

    user.username = req.body.username;
    user.department = Array.isArray(req.body.department)
      ? req.body.department
      : [req.body.department];
    user.propertyCount = Number(req.body.propertyCount);

    await user.save();
    res.json("User updated!");
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
});

// DELETE user
router.route("/:id").delete(async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    await NPIMSUser.findByIdAndDelete(id);
    res.json("User deleted.");
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
});

module.exports = router;
