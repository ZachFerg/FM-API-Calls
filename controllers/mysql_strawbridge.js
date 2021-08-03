// Dependencies
const controller = require("../models/mysql_strawbridge");

// Controller to get all rows
getAll = (req, res) => {
  const table = req.params.table;
  console.log('getting all the rows right now')
  controller.getAll(table, (err, controller) => {
    if (err) res.status(500).send(err);
  });
}

// Controller to add a new order
// addNewOrder = (req, res) => {
//   jsonSent = req.body;
//   console.log("coming from controllers file ", req.body.grade);

//   controller.addNewOrder(jsonSent, (err, controller) => {
//     if (err) res.status(500).send(err);
//     // console.log("the error is: ", err);
//   });
// };

// Export controllers
module.exports = {
  getAll,
  addNewOrder
};
