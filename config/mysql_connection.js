// Dependencies
require("dotenv").config();
const mysql = require("mysql");

// Set database connection credentials
const db_config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
};

// Create a MySQL pool
const connection = mysql.createPool(db_config);

// Export the pool
module.exports = connection;