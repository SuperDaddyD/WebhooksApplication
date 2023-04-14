const express = require("express");

const path = require("path");

const app = express();

const bodyParser = require("body-parser");

const { schoolModel } = require("./models/schoolModel.js");

const mongoose = require("mongoose");

const dbUrl = "mongodb://localhost:27017/student_data";

mongoose.connect(dbUrl);

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
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

  console.log("HERE IS THE BODY--->", schoolData);
  res.send(req.body);
});

app.post("/addWebHookEvent", async (req, res) => {
  let data = await req.body;

  let schoolDetails = await schoolModel.find({ schoolId: data.schoolId });

  if (schoolDetails) {
    if (schoolDetails.webHookDetails == null) {
      schoolDetails.webHookDetails = [];
    }
    let temp_schoolDetails;

    schoolDetails.webHookDetails.push({
      eventName: data.eventName,
      endpointUrl: data.endpointUrl,
    });

    console.log("-------Details------ ", schoolDetails);

    let test;
    try {
      test = await schoolModel.findOneAndUpdate(
        { _id: schoolDetails._id },

        schoolDetails,

        {
          returnOriginal: false,
        }
      );
      console.log("--------====== details------>>> ", schoolDetails);
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("This School Does Not Exist!!!");
  }

  console.log("HERE IS THE BODY--->", schoolDetails);
  res.send({ result: schoolDetails.webHookDetails });
});

app.post("/addStudent", async (req, res) => {
  let data = await req.body;

  let indx = await schoolModel.find().count();
  let schoolDetails = await schoolModel.find({ schoolId: data.schoolId });

  if (schoolDetails) {
    try {
      console.log("--------ADDED STUDENT----INFO--", req.body);

      schoolDetails = await new schoolModel.findOne({
        schoolName: data.schoolName,
        schoolId: indx + 1,
      });

      let schoolData = await schoolDetails.save();
      console.log("HERE IS THE BODY--->", schoolData);
      res.send({ resultz: schoolData });
    } catch (err) {}
  } else {
    console.log("This school didnt exist so no student can be added!");
  }
});

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});

mongoose.connection.on("connected", () => {
  console.log(`mongoose default connetion open to ${dbUrl} is fine`);
});
