const express = require("express");
require("dotenv").config();
const connection = require("./config/mysql_connection");
// const controller = require("./controllers/mysql_strawbridge");
// const apiRoutes = require('./routes/mysql_strawbridge');

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

app.use(express.json());

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

// Add a new order
app.post("/loroco_test", (request, response) => {
  // console.log(request.body);
  let keys = [];
  let values = [];
  let sql = "INSERT INTO loroco_test ( ?? ) VALUES( ? )";
  for (let x = 0; x < request.body.length; x++) {
    console.log("starting loops");
    let bit = request.body[x];
    for (let i in bit) {
      keys.push(i);
      values.push(bit[i]);
    }
    // console.log("keys: ", keys);
    // console.log("values: ", values);
    connection.query(sql, [keys, values], (error, result) => {
      if (error) throw error;
      // response.status(201).send(`Order added`);
      console.log("order added")
    });
    keys = [];
    values = [];
  }
  // console.log("this should show up last");
});

// Display all users
app.get("/loroco_test", (request, response) => {
  console.log("getting all lorocos");
  connection.query("SELECT * FROM loroco_test", (error, result) => {
    if (error) throw error;

    response.send(result);
  });
});
