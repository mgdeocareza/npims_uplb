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
  staffInCharge: {
    type: String,
    required: true,
  },
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
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    acquisitionType: {
      type: String,
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
    endUser: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },

    historyLog: [HistoryEntrySchema],
  },
  {
    timestamps: true,
  }
);

const NPIMSProperty = mongoose.model("NPIMSProperty", NPIMSPropertySchema);

module.exports = NPIMSProperty;
