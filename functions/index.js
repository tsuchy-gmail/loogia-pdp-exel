const info = require("./app/src/secret.js");
const functions = require("firebase-functions");

const express = require("express");
const basicAuth = require("basic-auth-connect");
const app = express();

app.all(
  "*",
  basicAuth(function (user, password) {
    return user === info.user && password === info.password;
  })
);

app.use(express.static(__dirname + "/app/build/"));

exports.app = functions.https.onRequest(app);
