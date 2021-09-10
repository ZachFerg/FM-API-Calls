/* eslint-disable no-undef */
const express = require("express");
require("dotenv").config();
const connection = require("./config/mysql_connection");
// const controller = require("./controllers/mysql_strawbridge");
// const apiRoutes = require('./routes/mysql_strawbridge');

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

// app.use(express.json());
app.use(express.json({ limit: "50mb" }));

// app.use('/', apiRoutes)

// main page
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Fotomerchant Application listening at http://${hostname}:${port}`
  );
});

// Display all orders
app.get("/loroco_test", (request, response) => {
  console.log("getting all orders");
  connection.query("SELECT * FROM loroco_test LIMIT 50", (error, result) => {
    if (error) throw error;

    response.send(result);
  });
});

// Add a new order
app.post("/loroco_test", (request, response) => {
  function bulkInsert(connection, table, objectArray, callback) {
    let keys = Object.keys(objectArray[0]);
    let values = objectArray.map((obj) => keys.map((key) => obj[key]));
    let sql = "INSERT INTO " + table + " (" + keys.join(",") + ") VALUES ?";
    connection.query(sql, [values], function (error, results, fields) {
      if (error) callback(error);
      return callback(null, results);
    });
  }

  bulkInsert(connection, "loroco_test", request.body, (error, result) => {
    if (error) response.send(error);
    // console.log(result.affectedRows + " orders were added to the database")
    return response.send(
      result.affectedRows + " orders were added to the database"
    );
  });
});
