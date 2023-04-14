const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  schoolName: String,
  schoolId: Number,
  webHookDetails: [
    {
      eventName: String,
      endpointUrl: String,
    },
  ],
});

const schoolModel = mongoose.model("schools", schoolSchema);

exports.schoolModel = schoolModel;
