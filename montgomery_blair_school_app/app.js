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
app.post("/webhook", (req, res) => {
  let data = req.body;

  console.log("name: "+data.name);
  res.send({message:'WEB HOOK RECIEVED!' });
});

app.listen(PORT, () => {
  console.log(`Blair High School App listening on port ${PORT}`);
});
