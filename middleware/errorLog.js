const { logEvents } = require("./logEvents");

const errorLog = (err, req, res, next) => {
  logEvents(
    `${req.headers.origin} ${req.url} ${err.name} ${err.message}`,
    "errorLog.txt"
  );
  console.log(err.stack);
  res.status(500).send(err.message);
};

module.exports = errorLog;
