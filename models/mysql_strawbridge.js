// Dependencies
const connection = require("../config/mysql_connection");

// Object for model
const model = (model) => {
  this.model = model;
};

model.createOne = (table, jsonSent, result) => {
  let keys = [];
  let values = [];
  let sql = "INSERT INTO ?? ( ?? ) VALUES( ? )";
  console.log(sql);
  console.log('json length is ', jsonSent.length)
  for (let x = 0; x < jsonSent.length; x++) {
    console.log("starting loops")
    let bit = jsonSent[x];
    for (let i in bit) {
      keys.push(i);
      values.push(bit[i]);
    }
    connection.query(sql, [table, keys, values], (err, rows) => {
      if (err) result(err);
      result(null, rows);
    });
    keys = [];
    values = [];
  }
};

// Export model object
module.exports = model;
