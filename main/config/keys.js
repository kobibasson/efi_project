const fs = require("fs");

var key = null,
  cert = null,
  passphrase = null;

if (process.env.NODE_ENV == "production") {
  key = fs.readFileSync("./config/private.key");
  cert = fs.readFileSync("./config/certificate.pem");
  passphrase = "1234";
}

const keys = {
  ssl: {
    key,
    cert,
    passphrase
  }
};
module.exports = keys;
