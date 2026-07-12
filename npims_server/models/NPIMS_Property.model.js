const mongoose = require("mongoose");

const HistoryEntrySchema = new mongoose.Schema({
  dateAssigned: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  staffInCharge: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "NPIMSUser",        
    required: true,
  }],
});

const NPIMSPropertySchema = new mongoose.Schema(
  {
    propertyNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    propertyType: {
      type: String,
      enum: ["Electronic", "Non-electronic"],
      required: true,
    },
    article: {
      type: String,
      enum: ["Computer - Windows", "Computer - Mac", "Laptop", "Tablet", "Projector", "Printer", "Barcode Scanner", "Book Scanner", "UPS", "Aircon", "TV", "Flashdrive", "Camera", "Conference Table", "Center Table", "Computer Table", "Chair", "Stool Chair", "Cabinet", "Card Catalog", "Others - Electronic", "Others - Non Electronic"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    acquisitionType: {
      type: String,
      enum: ["PAR", "ICS"],
      required: true,
    },
    dateAcquired: {
      type: Date,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    staffInCharge: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    }],
    location: {
      type: String,
      enum: [
      "Main Library - Acquisitions Section", 
      "Main Library - Cataloging and Classification Section",
      "Main Library - Financial and Administrative Section",
      "Main Library - General References and Information Services Section",
      "Main Library - E-Resources and Multimedia Services Section",
      "Main Library - Filipiniana and Serials Section",
      "Main Library - University Archives and Knowledge Repository Section",
      "Main Library - Office of the University Librarian",
      "Others"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "For Repair", "Unserviceable", "Condemned"],
      required: true,
    },
    images: [{
      type: String,
      required: false, 
    }],


    historyLog: [HistoryEntrySchema],
  },
  {
    timestamps: true,
    collection: "npimsproperties",
  }
);

const NPIMSProperty = mongoose.model("NPIMSProperty", NPIMSPropertySchema);

module.exports = NPIMSProperty;
