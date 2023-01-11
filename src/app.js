const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

app.use(express.static("Public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const a = req.body.fname;
  const b = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: a,
          LNAME: b,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us18.api.mailchimp.com/3.0/lists/a8084fa3fb";

  const option = {
    // As we want to get data so we use this parameters
    method: "POST",
    auth: "john1:7e45324916d52d577f6b98f459dc67e8-us18",
  };

  const request = https.request(url, option, function (response) {
    // Making a request

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.use("/.netlify/functions/api", router);
module.exports = app;

module.exports.handler = serverless(app);

app.listen(3000, function () {
  console.log(`Server is running on port ${3000}`);
});

//Api Key
// 7e45324916d52d577f6b98f459dc67e8-us18

//Unique id
// a8084fa3fb
