/* eslint-disable no-undef */
const express = require('express');
require('dotenv').config();
const connection = require('./config/mysql_connection');

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

app.use(express.json({ limit: '100mb' }));

// main page
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = app.listen(port, () => {
  console.log(
    `Fotomerchant Application listening at http://${hostname}:${port}`,
  );
});

server.setTimeout(0);

// Display all orders
app.get('/orders', (request, response) => {
  console.log('getting all orders');
  connection.query(
    'SELECT * FROM orders LIMIT 50',
    (error, result) => {
      if (error) throw error;

      response.send(result);
    },
  );
});

// Add a new order
app.post('/orders', (request, response) => {
  function bulkInsert(connection, table, objectArray, callback) {
    let keys = Object.keys(objectArray[0]);
    let values = objectArray.map((obj) =>
      keys.map((key) => obj[key]),
    );
    let sql =
      'INSERT INTO ' + table + ' (' + keys.join(',') + ') VALUES ?';
    // console.log(keys);
    // console.log(values);
    connection.query(
      sql,
      [values],
      function (error, results, fields) {
        if (error) return callback(error);
        // console.log(results);
        return callback(null, results);
      },
    );
  }

  bulkInsert(connection, 'orders', request.body, (err, result) => {
    if (err) {
      // console.log(err);
      console.log(err.code);
      console.log(err.message);
      response.send(err);
    } else {
      return response.send('orders were added to the database');
    }
    // console.log(result.affectedRows + " orders were added to the database")
  });
});
