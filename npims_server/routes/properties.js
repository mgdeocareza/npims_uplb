const router = require("express").Router();
const mongoose = require("mongoose");
let NPIMSProperty = require("../models/NPIMS_Property.model");

// GET all properties
router.route("/").get((req, res) => {
  NPIMSProperty.find()
    .then((properties) => res.json(properties))
    .catch((err) => res.status(400).json("Error: " + err));
});

// GET property by ID
router.route("/:id").get((req, res) => {
  let id = new mongoose.Types.ObjectId(req.params.id);
  NPIMSProperty.findById(id)
    .then((property) => res.json(property))
    .catch((err) => res.status(400).json("Error: " + err));
});

// ADD new property with initial history log
router.route("/add").post((req, res) => {
  const {
    propertyNumber,
    propertyType,
    description,
    acquisitionType,
    dateAcquired,
    unitPrice,
    endUser,
    location,
    status
  } = req.body;

  // Initial history log
  const historyEntry = {
    dateAssigned: dateAcquired,
    location,
    staffInCharge: endUser
  };

  const newProperty = new NPIMSProperty({
    propertyNumber,
    propertyType,
    description,
    acquisitionType,
    dateAcquired,
    unitPrice,
    endUser,
    location,
    status,
    historyLog: [historyEntry]
  });

  newProperty
    .save()
    .then(() => res.json("Property added with initial history log!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

// UPDATE property
router.route("/update/:id").post((req, res) => {
  let id = new mongoose.Types.ObjectId(req.params.id);
  NPIMSProperty.findById(id)
    .then((property) => {
      property.propertyNumber = req.body.propertyNumber;
      property.propertyType = req.body.propertyType;
      property.description = req.body.description;
      property.acquisitionType = req.body.acquisitionType;
      property.dateAcquired = new Date(req.body.dateAcquired);
      property.unitPrice = Number(req.body.unitPrice);
      property.endUser = req.body.endUser;
      property.location = req.body.location;
      property.status = req.body.status;
      property.historyLog = req.body.historyLog;  

      property
        .save()
        .then(() => res.json("Property updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// DELETE property
router.route("/:id").delete((req, res) => {
  let id = new mongoose.Types.ObjectId(req.params.id);
  NPIMSProperty.findByIdAndDelete(id)
    .then(() => res.json("Property deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

// ADD history entry to a property
router.route("/update-history/:id").post((req, res) => {
  let id = new mongoose.Types.ObjectId(req.params.id);

  const newHistoryEntry = {
    dateAssigned: req.body.dateAssigned,
    location: req.body.location,
    staffInCharge: req.body.staffInCharge,
  };

  NPIMSProperty.findById(id)
    .then((property) => {
      property.historyLog.push(newHistoryEntry);
      property
        .save()
        .then(() => res.json("History entry added!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
