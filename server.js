const path = require("path");
const express = require("express");
const favicon = require('serve-favicon');

const app = express();

app.get("*", (req, res, next) => {
  console.log(req.url);
  next();
})

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

const options = {
  setHeaders (res, filePath, stat) {
    res.set({
      "cache-control": "no-cache, max-age=0"
    })
  }
}
app.use(express.static("src", options));
app.use(express.static("sw", {
  maxAge: 0
}))

app.listen("9000", () => {
  console.log("server start at localhost:9000");
})
