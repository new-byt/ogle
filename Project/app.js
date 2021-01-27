const express = require("express");
const admin = require("firebase-admin");
const fs = require("fs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
app.use("/", express.static("public"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

var serviceAccount = require(__dirname + "/account.json");

app.use(cookieParser());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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

app.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/");
});

app.post("/login", (req, res) => {
  // Get ID token and CSRF token.
  const idToken = req.body.idToken;
  // 5 minutes.
  const expiresIn = 60 * 5 * 1000;
  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // We could also choose to enforce that the ID token auth_time is recent.
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(function (decodedClaims) {
      // In this case, we are enforcing that the user signed in in the last 5 minutes.
      if (new Date().getTime() / 1000 - decodedClaims.auth_time < 5 * 60) {
        return admin
          .auth()
          .createSessionCookie(idToken, { expiresIn: expiresIn });
      }
      throw new Error("UNAUTHORIZED REQUEST!");
    })
    .then(function (sessionCookie) {
      // Note httpOnly cookie will not be accessible from javascript.
      // secure flag should be set to true in production.
      const options = {
        maxAge: expiresIn,
        httpOnly: true,
        secure: false,
      };
      res.cookie("session", sessionCookie, options);
      res.end(JSON.stringify({ status: "success" }));
    })
    .catch(function (error) {
      res.status(401).send("UNAUTHORIZED REQUEST!");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
