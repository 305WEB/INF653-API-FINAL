// NPM modules
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

// Code Modules
const fs = require("fs");
const path = require("path");
const fsPromises = require("fs").promises;

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "MM-dd-yyyy\thh:mm:ss")}`;
  const logItem = `${dateTime} \t ${uuid()} \t ${message} \n`;
  console.log(logItem);

  // Use try block to Check if a folder named "logs" exists Or else create one
  // Create a file named "eventLogs.txt" inside the folder and use append to register the logItem in the eventLogs file
  // Use error block to catch the errors

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method} ${req.headers.origin} ${req.url}`, "reqLog.txt");
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logEvents, logger };

// logEvents("This is Test");
