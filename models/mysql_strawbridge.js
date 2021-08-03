// Dependencies
const connection = require("../config/mysql_connection");

// Object for model
const model = (model) => {
  this.model = model;
};

// Query get all rows
model.getAll = (result) => {
  let sql = `SELECT * FROM loroco_test`;
  connection.query(sql, (err, rows) => {
    if (err) result(err);
    res.send(result);
    console.log("acquired all rows")
  });
};

// Add new order
model.addNewOrder = (jsonSent, result) => {
  let sql = "INSERT INTO loroco_test SET ?";

  connection.query(sql, jsonSent, (error, rows) => {
    if (error) result(error);

    console.log("Order Added successfully")
    // rows.status(201).send(`Order added`);
  });
};

// Export model object
module.exports = model;
