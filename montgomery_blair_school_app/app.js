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
  console.log("YEP BLAIR!");
  let data = await req.body;

  await console.table(data.name);
  res.send({ message: "WEB HOOK RECIEVED!" });
});

app.listen(PORT, () => {
  console.log(`Blair High School App listening on port ${PORT}`);
});
