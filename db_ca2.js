// Import the mysql2 library
var mysql = require("mysql2");

// Create the connection to the MySQL database
var connection = mysql.createConnection({
  host: "localhost", // MySQL server location
  user: "root", // your MySQL username
  password: "lopez2424", // your MySQL password
  database: "Server_side_Ca2", // your database name
});

// Connect to the database
connection.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected");
  // Run a simple SELECT query to get all rows
  // connection.query("SELECT * FROM mysql_table", function (err, results) {
  //   if (err) throw err;

  //   console.log("Data from user_data table:");
  //   console.table(results); // display rows in a nice table format
  // });
});
module.exports = connection; // Export the connection for server.js
