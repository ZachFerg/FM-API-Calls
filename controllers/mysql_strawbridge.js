// Dependencies
const controller = require('../models/mysql_strawbridge');


createOne = (req, res) => {
    const table = req.params.table;
    const jsonSent = req.body;
  
    console.log('Table is ', table)
    console.log("the req.body is: ", jsonSent);
  
    controller.createOne(table, jsonSent, (err, controller) => {
      if (err) res.status(500).send(err);
      console.log('the error is: ', err)
    });
  };
  