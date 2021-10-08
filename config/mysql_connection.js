// Dependencies
require('dotenv').config({ path: '../.ENV' });
const mysql = require('mysql');

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

console.log('connecting to ' + db_config.host);
console.log(
  'user ' +
    db_config.user +
    ' is signing in to ' +
    db_config.database,
);

// Export the pool
module.exports = connection;
