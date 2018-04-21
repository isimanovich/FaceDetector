var express = require("express");
var app = express();

app.use(function(req, res, next) {
  if (true) {
    res.redirect('/server/server');
    return;
  }
  next();
});