const express = require("express");
const path = require("path");
const https = require("https");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const app = express();
const legacyApp = express();

connectDB();

app.use("/api/hotfixer", bodyParser.urlencoded({ extended: false }));
app.use("/api/hotfixer", bodyParser.json());

// Use Routes
app.use("/api/sip", require("./routes/api/sip"));
app.use("/api/injector", require("./routes/api/injector"));
app.use("/api/hotfixer", require("./routes/api/hotfixer"));
legacyApp.use("/apps", require("./routes/scripter/scripter"));

if (process.env.NODE_ENV === "production") {
  const { ssl } = require("./config/keys");
  const efiServer = https.createServer(ssl, app);
  const efiLegacy = https.createServer(ssl, legacyApp);
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });

  var http = require("http");
  http
    .createServer(function(req, res) {
      res.writeHead(301, {
        Location: "https://" + req.headers["host"] + req.url
      });
      res.end();
    })
    .listen(80);

  efiServer.listen(443, () => console.log("App running HTTPS over 443"));
  efiLegacy.listen(8443, () => console.log("App running HTTPS over 8443"));
} else {
  const port = process.env.API_PORT || 5000;
  legacyApp.listen(8443, () => console.log("App running over 8443"));
  app.listen(port, () => console.log(`App listening on ${port}`));
}
