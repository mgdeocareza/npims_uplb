const router = require("express").Router();
const mongoose = require("mongoose");
let NPIMSUser = require("../models/NPIMS_User.model");

router.route("/").get((req, res) => {
  NPIMSUser.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  let id = new mongoose.Types.ObjectId(req.params.id);
  NPIMSUser.findById(id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const username = req.body.username;
  const department = req.body.department;
  const propertyCount = 0;

  const newUser = new NPIMSUser({
    username,
    department,
    propertyCount,
  });

  newUser
    .save()
    .then(() => res.json("User added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});


router.route("/update/:id").post((req, res) => {
  let id = new mongoose.Types.ObjectId(req.params.id);
  NPIMSUser.findById(id)
    .then((user) => {
      user.username = req.body.username;
      user.department = req.body.department;
      user.propertyCount = Number(req.body.propertyCount);

      user
        .save()
        .then(() => res.json("User updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  let id = new mongoose.Types.ObjectId(req.params.id);
  NPIMSUser.findByIdAndDelete(id)
    .then(() => res.json("User deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
