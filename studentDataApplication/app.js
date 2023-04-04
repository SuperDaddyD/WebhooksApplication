const express = require("express");

const path = require("path");

const app = express();

const bodyParser = require("body-parser");

const { schoolModel } = require("./models/schoolModel.js");

const mongoose = require("mongoose");

const dbUrl = "mongodb://localhost:27017/student_data";

mongoose.connect(dbUrl);

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
//cool debugging https://www.youtube.com/watch?v=qz68RsESlp8

app.use(bodyParser.json());

const file = require("../file.txt");

const PORT = process.env.PORT || 3000;

const loadFile = (arg) => {
  return arg.map((item) => item.name);
};

app.get("/", (req, res) => {
  const fileText = loadFile(file);
  console.log("OK This-->", fileText);
  res.status(200).send(fileText);
});

app.post("/register", async (req, res) => {
  let data = await req.body;

  const index = await schoolModel.find().count();

  const schoolDetails = await new schoolModel({
    schoolName: data.schoolName,
    schoolId: index + 1,
  });

  let schoolData = await schoolDetails.save();

  console.log("HERE IS THE BODY--->", req.body);
  await res.send({
    results: schoolData,
  });
});

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});

mongoose.connection.on("connected", () => {
  console.log(`mongoose default connetion open to ${dbUrl} is fine`);
});
