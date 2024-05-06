const express = require("express");
const router = express();
const path = require("path");

// ^/$ it only servers the default page ((.html) it can work wiouth file extension).

// ".." = goes to outside folder

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

// serves new page

router.get("/new-page.html", (req, res) => {
  //   res.sendFile("./views/new-page.html", { root: __dirname });

  res.sendFile(path.join(__dirname, "..", "views", "new-page.html"));
});

// redirects from old to new page

router.get("/old-page.html", (req, res) => {
  res.redirect(301, "/new-page.html");
});

// const GetState = require("../controller/stateController");

// router.get("/states/:state", GetState);

module.exports = router;
