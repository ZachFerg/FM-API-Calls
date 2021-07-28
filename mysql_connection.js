// Dependencies
require("dotenv").config();
const mysql = require("mysql");
const nodeEnv = process.env.NODE_ENV;

// function to add timestamp to console.log
let DEBUG = (function () {
  let timestamp = function () {};
  timestamp.toString = function () {
    return "[DEBUG " + new Date().toLocaleTimeString() + "]";
  };

  return {
    log: console.log.bind(console, "%s", timestamp),
  };
})();

const db_config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
};
let connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config);

  connection.connect(function (err) {
    if (err) {
      DEBUG.log("error when connecting to db:", err);
      DEBUG.log("before the time out");
      setTimeout(handleDisconnect, 2000);
    }
  });
  connection.on("error", function (err) {
    DEBUG.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

console.log("connecting to " + nodeEnv);
console.log("host is: " + db_config.host);
console.log("connecting to " + db_config.database);