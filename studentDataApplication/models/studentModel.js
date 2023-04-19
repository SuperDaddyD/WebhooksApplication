const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  schoolId: String,
  name: String,
  age:Number
});

const studentModel = mongoose.model("students", studentSchema);

exports.studentModel = studentModel;
