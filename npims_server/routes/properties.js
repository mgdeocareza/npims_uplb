const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const NPIMSProperty = require("../models/NPIMS_Property.model");
const NPIMSUser = require("../models/NPIMS_User.model");

// ==== Multer Configuration ====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ==== Static File Serving for Uploaded Images ====
router.use("/uploads", express.static("uploads"));

// ==== GET All Properties ====
router.route("/").get((req, res) => {
  NPIMSProperty.find()
    .populate("staffInCharge", "username")
    .then((properties) => res.json(properties))
    .catch((err) => res.status(400).json("Error: " + err));
});

// ==== GET Property by ID ====
router.route("/:id").get((req, res) => {
  let id = new mongoose.Types.ObjectId(req.params.id);
  NPIMSProperty.findById(id)
    .populate("staffInCharge", "username")
    .then((property) => res.json(property))
    .catch((err) => res.status(400).json("Error: " + err));
});

// ==== ADD New Property with Images & History ====
router.route("/add").post(upload.array("images", 5), async (req, res) => {
  try {
    const {
      propertyNumber,
      propertyType,
      article,
      description,
      acquisitionType,
      dateAcquired,
      unitPrice,
      staffInCharge,
      location,
      status
    } = req.body;

    const historyEntry = {
      dateAssigned: dateAcquired,
      location,
      staffInCharge: staffInCharge,
    };

    const imageFilenames = req.files ? req.files.map(file => file.filename) : [];

    const newProperty = new NPIMSProperty({
      propertyNumber,
      propertyType,
      article,
      description,
      acquisitionType,
      dateAcquired,
      unitPrice,
      staffInCharge,
      location,
      status,
      images: imageFilenames,
      historyLog: [historyEntry],
    });

    await newProperty.save();

    if (Array.isArray(staffInCharge)) {
      await NPIMSUser.updateMany(
        { _id: { $in: staffInCharge } },
        { $inc: { propertyCount: 1 } }
      );
    }

    res.json("Property added with images and history log!");
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
});

// ==== UPDATE Property ====
router.route("/update/:id").post(upload.array("images", 5), (req, res) => {
  let id = new mongoose.Types.ObjectId(req.params.id);

  NPIMSProperty.findById(id)
    .then((property) => {
      property.propertyNumber = req.body.propertyNumber;
      property.propertyType = req.body.propertyType;
      property.article = req.body.article;
      property.description = req.body.description;
      property.acquisitionType = req.body.acquisitionType;
      property.dateAcquired = new Date(req.body.dateAcquired);
      property.unitPrice = Number(req.body.unitPrice);
      property.staffInCharge = req.body.staffInCharge;
      property.location = req.body.location;
      property.status = req.body.status;
      property.historyLog = JSON.parse(req.body.historyLog);

      // Append new uploaded images if any
      const imageFilenames = req.files ? req.files.map(file => file.filename) : [];
      property.images = [...(property.images || []), ...imageFilenames];

      property
        .save()
        .then(() => res.json("Property updated with images!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});


// ==== DELETE Property ====
router.route("/:id").delete((req, res) => {
  let id = new mongoose.Types.ObjectId(req.params.id);
  NPIMSProperty.findByIdAndDelete(id)
    .then(() => res.json("Property deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

// ==== ADD History Entry to Property ====
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
