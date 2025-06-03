const mongoose = require("mongoose");



const NPIMSUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    department: [{
      type: String,
      required: true,
      enum: ["Office of the University Librarian", "Acquisitions Section", "Cataloging and Classification Section", "Financial and Administrative Section", "General References and Information Services Section", "E-Resources and Multimedia Services Section", "Filipiniana and Serials Section", "University Archives and Knowledge Repository Section", "Others"],
    }],
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
