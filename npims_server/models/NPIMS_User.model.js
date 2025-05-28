const mongoose = require("mongoose");



const NPIMSUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
    },
    propertyCount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const NPIMSUser = mongoose.model("NPIMSUser", NPIMSUserSchema);

module.exports = NPIMSUser;
