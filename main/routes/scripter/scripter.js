const express = require("express");
const router = express();

router.get("/scripter.html", (req, res) => {
  res.sendFile(__dirname + "/scripter.html");
});

router.get("/injector.html", (req, res) => {
  res.sendFile(__dirname + "/injector.html");
});

router.get("/sec.js", (req, res) => {
  res.sendFile(__dirname + "/sec.js");
});

router.get("/bg.jpg", (req, res) => {
  res.sendFile(__dirname + "/bg.jpg");
});

module.exports = router;
