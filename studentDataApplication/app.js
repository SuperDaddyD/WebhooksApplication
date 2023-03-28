const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("HELLO FROM STUDENT SERVER!!");
});
app.get("/register", (req, res) => {
  res.send("You ARE REGISTERED!!!!!");
});

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
