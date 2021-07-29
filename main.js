const express = require("express");
const app = express();

const connection = require("./config/mysql_connection"); // Load the MySQL pool connection

const hostname = "127.0.0.1";
const port = 3000;

app.listen(port, () => {
  console.log(
    `Fotomerchant Application listening at http://${hostname}:${port}`
  );
});

// main page
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Display all users
app.get("/employees", (request, response) => {
  connection.query("SELECT * FROM employees", (error, result) => {
    if (error) throw error;

    response.send(result);
  });
});

// Add a new order
app.post('/loroco_test', (request, response) => {
  connection.query('INSERT INTO loroco_test VALUES ?', request.body, (error, result) => {
      if (error) throw error;

      response.status(201).send(`Order added with ID: ${result}`);
  });
});

// Display a single user by ID
app.get("/employees/:employeeNumber", (request, response) => {
  const employeeNumber = request.params.employeeNumber;
  console.log(employeeNumber);

  connection.query(
    "SELECT * FROM employees WHERE employeeNumber = ?",
    employeeNumber,
    (error, result) => {
      if (error) throw error;

      response.send(result);
    }
  );
});
