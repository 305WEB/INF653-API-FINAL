const express = require("express");
const router = express();
const path = require("path");

// ^/$ it only servers the default page ((.html) it can work wiouth file extension).

// ".." outside folder >  "views" folder >  "subdir"

router.get("^/$|/sub(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "subdir", "sub.html"));
});

// serves test page

router.get("/test.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "subdir", "test.html"));
});

module.exports = router;
