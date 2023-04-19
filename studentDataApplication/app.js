const express = require("express");

const path = require("path");

const app = express();

const bodyParser = require("body-parser");

const { schoolModel } = require("./models/schoolModel.js");
const { studentModel } = require("./models/studentModel.js");

const mongoose = require("mongoose");

const dbUrl = "mongodb://localhost:27017/student_data";

mongoose.connect(dbUrl);

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
//cool debugging https://www.youtube.com/watch?v=qz68RsESlp8

app.use(bodyParser.json());

const file = require("../file.txt");
const axios = require("axios");

const PORT = process.env.PORT || 3000;

const loadFile = (arg) => {
  return arg.map((item) => item.name);
};

//JUST TESTING THAT SERVER ROUTING WORKS
app.get("/", (req, res) => {
  const fileText = loadFile(file);
  console.log("OK This-->", fileText);
  res.status(200).send(fileText);
});

//FIRST REGISTER SCHOOL SO IT CAN LATER BE QUERIED IN DATABASE
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

//SECOND ADD THE ACTUAL WEBHOOK EVENT NAME AND URL TO SCHOOL YOU WANT TO HAVE ACCESS TO HOOK
app.post("/addWebHookEvent", async (req, res) => {
  let data = await req.body;

  let schoolDetails = await schoolModel.findOne({ "schoolId": data.schoolId });

  if (schoolDetails) {
    if (schoolDetails.webHookDetails == null) {
      schoolDetails.webHookDetails = [];
    }

    schoolDetails.webHookDetails.push({
      eventName: data.eventName,
      endpointUrl: data.endpointUrl,
    });

    schoolDetails = await schoolModel.findOneAndUpdate(
      { "schoolId": schoolDetails.schoolId },
      schoolDetails,
      {
        returnOriginal: false,
      }
    );
  } else {
    console.log("No School With This Name!");
  }

  console.log("HERE IS THE BODY--->", schoolDetails);
  res.send({ result: schoolDetails });
});

app.post("/addStudent", async (req, res) => {
  let data = req.body;

  let schoolDetails = await schoolModel.findOne({ "schoolId": data.schoolId });

  if (schoolDetails) {
    try {
      let studentDetails = new studentModel({
        schoolId: data.schoolId,
        name: data.name,
        age: data.age,
      });

      let schoolData = await studentDetails.save();
      console.log("--------School Details--", schoolDetails);

      let webhookUrl = "";

      schoolDetails.webHookDetails.map((item) => {
        if (item.eventName == "newStudentAdded") {
          webhookUrl = item.endpointUrl;
        }
      });

      if (webhookUrl != null && webhookUrl.length > 0) {
        axios.post(webhookUrl, studentDetails, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      console.log("HERE IS THE BODY--->", schoolData);

      res.send({ resultz: "Added A Student To Another Server!" });
    } catch (err) {
      console;
    }
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
