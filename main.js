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

// // Add a new order
// app.post("/loroco_test", (request, response) => {
//   // console.log(request.body);
//   // let keys = [];
//   let keys = Object.keys(request.body[0]);
//   let values = [];
//   let sql = "INSERT INTO loroco_test ( ?? ) VALUES( ? )";

//   console.log("keys: ", keys);

//   for (let x = 0; x < request.body.length; x++) {
//     // console.log("starting loops");
//     let bit = request.body[x];
//     for (let i in bit) {
//       // keys.push(i);
//       values.push(bit[i]);
//     }
//     // connection.query(sql, [keys, values], (error, result) => {
//     //   if (error) throw error;
//     //   // response.status(201).send(`Order added`);
//     //   console.log("order added")
//     // });
//     // keys = [];
//     // values = [];
//   }
//   console.log("values: ", values);
//   connection.query(sql, [keys, values], (error, result) => {
//     if (error) throw error;
//     // response.status(201).send(`Order added`);
//     console.log("order added")
//   });
//   // console.log("this should show up last");
// });

// Display all users
app.get("/loroco_test", (request, response) => {
  console.log("getting all lorocos");
  connection.query("SELECT * FROM loroco_test", (error, result) => {
    if (error) throw error;

    response.send(result);
  });
});

// Add a new order
app.post("/loroco_test", (request, res) => {

  function bulkInsert(connection, table, objectArray, callback) {
    let keys = Object.keys(objectArray[0]);
    let values = objectArray.map( obj => keys.map( key => obj[key]));
    let sql = 'INSERT INTO ' + table + ' (' + keys.join(',') + ') VALUES ?';
    console.log(sql);
    connection.query(sql, [values], function (error, results, fields) {
      // console.log(connection.query(sql, [values]));
      if (error) callback(error);
      callback(null, results);
    });
  }
  
  bulkInsert(connection, 'loroco_test', request.body, (error, response) => {
    if (error) res.send(error);
    console.log(error);
    // res.json(response);
    console.log(res.statusCode);
    console.log(response);
    // res.status(200).send(`Order added`);
  });
  
});