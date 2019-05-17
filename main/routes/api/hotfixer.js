const express = require("express");
const axios = require("axios");
const fs = require("fs");
const router = express();

var proxy = "172.20.169.101:8080";

const url = "http://" + proxy + "/api/sftp";
const config = {
  headers: { "Content-Type": "application/json" }
};

router.post("/", async (req, res) => {
  try {
    const response = await axios.post(url, req.body, config);
    return res.json(response.data);
  } catch (error) {
    return res.json(error.response.data);
  }
});

module.exports = router;
