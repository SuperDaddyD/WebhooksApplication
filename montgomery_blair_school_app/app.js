const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const PORT = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  console.log("HEY YOU JUST HIT BLAIR!!!");
  res.send({ name: "Benjamin Grim!" });
});

app.post("/webhook/addStudent", async (req, res) => {
  let data = await req.body;
  console.log("YEP BLAIR!", data);

  await console.table(data);
  res.send({ message: "WEB HOOK RECIEVED!" });
});

app.post("/webhook/myMadeUpHook", async (req, res) => {
  try {
    const data = await req.body;
    console.log("THIS IS THE MY PUFFY HOOK DATA-->", req.body);
    res.send({ yep: data.puff });
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => {
  console.log(`Blair High School App listening on port ${PORT}`);
});
