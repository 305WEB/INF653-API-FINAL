// .env file
require("dotenv").config();

// ---------------------------- SERVER USING EXPRESS JS
const express = require("express");
const app = express();
// const port = 3000;
const path = require("path");
// cors
const cors = require("cors");
// import logEvents functions
const { logger, logEvents } = require("./middleware/logEvents");
// error log
const errorLog = require("./middleware/errorLog");

// corsOptions
const corsOptions = require("./config/corsOptions");

// ** Mongoose db
const connectDB = require("./config/dbConfig");
const { default: mongoose } = require("mongoose");

const PORT = process.env.PORT || 3000;

// stateController
const stateController = require("./controller/stateController");

//  ** Connecting to Database - Connect DB
connectDB();

// Cusom midleware function logger
app.use(logger);

// CORS
app.use(cors(corsOptions));

// ----------------------------Express Middleware fucntions
app.use(express.urlencoded({ extended: false }));
/// static path to CSS files etc
app.use(express.static(path.join(__dirname, "/public")));
/// static path to subdir files
app.use("/subdir", express.static(path.join(__dirname, "/public")));
// will parse json files
app.use(express.json());

//----------ROUTES
app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));

//------- Redirect for states/query string

app.get("/states", (req, res) => {
  // Extract the 'contig' query parameter
  const contigParam = req.query.contig;

  if (contigParam === undefined) {
    // If 'contig' parameter does not exist, redirect to GetAllStates
    stateController.GetAllStates(req, res);
    // Check the value of 'contig' parameter
  } else if (contigParam === "true") {
    // If 'contig' is 'true', redirect to GetContiguousStates
    stateController.GetContiguousStates(req, res);
  } else if (contigParam === "false") {
    // If 'contig' is 'false', redirect to GetNonContiguousStates
    stateController.GetNonContiguousStates(req, res);
  } else {
    res.status(400).send("Invalid value for contig parameter");
  }
});

// --------- API router
app.use("/states", require("./routes/api/states"));

// 404 route for un-defined
app.all("*", (req, res) => {
  //
  res.status(404);
  //
  if (req.accepts("html")) {
    //
    res.sendFile(path.join(__dirname, "views", "404.html"));
    //
  } else if (req.accepts("json")) {
    //
    res.json({ error: "404 Not Found" });
    //
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// error logs
app.use(errorLog);

// Mongoose db connection

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
