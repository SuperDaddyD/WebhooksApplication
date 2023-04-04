const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  schoolName: String,
  schoolId: Number,
});

const schoolModel = mongoose.model("schools", schoolSchema);

exports.schoolModel = schoolModel;
