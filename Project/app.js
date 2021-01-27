const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.use("/", express.static("public"));

app.use(function (req, res, next) {
  if (req.originalUrl && req.originalUrl.split("/").pop() === "favicon.ico") {
    return res.sendStatus(204);
  }
  return next();
});

app.get("*", (req, res) => {
  try {
    var page = __dirname + "/html" + req.path + ".html";
    if (fs.existsSync(page)) {
      res.sendFile(page);
    } else {
      res.sendFile(__dirname + "/html/index.html");
    }
  } catch (err) {
    console.error(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
