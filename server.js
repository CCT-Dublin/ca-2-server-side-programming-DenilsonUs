// Import the express module to handle web requests
const express = require("express");
const path = require("path");
// Create an instance of express so we can use its functions
const app = express();

// Import the database connection
var connection = require("./Model/db_ca2.js");

// MIDDLEWARE
// ===============================
// Middleware to read form data (every incoming request passes through before the route handler)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (CSS, JavaScript, images) from the public folder
app.use(express.static("Public"));

//==============================
// Content Security Policy (CSP) middleware to prevent XSS attacks
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self';"
  );
  next();
});

/*
 middleware to log all incoming HTTP requests.
  This runs before any route handler and helps with debugging.
*/
app.use((req, res, next) => {
  console.log(`${req.method} request received for ${req.url}`);
  next(); // Pass control to the next middleware or route
});

// DATABASE SCHEMA VERIFICATION (Health Check)
// ===============================
// Verify database schema on server startup
connection.query("DESCRIBE mysql_table", (err) => {
  if (err) {
    console.error("Database schema verification failed:", err.message);
  } else {
    console.log("Database schema verified successfully.");
  }
});

//======================
//ROUTES
/**
 * GET /
 * Load the form when accessing http://localhost:3000
 */
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "Views", "form.html"));
});

/**
 * POST /submit
 * Handle form submission and insert into database
 */
app.post("/submit", function (req, res) {
  // Extract the form data from the request
  var firstName = req.body.frname;
  var lastName = req.body.ltname;
  var email = req.body.email;
  var phoneNumber = req.body.phoneNumber;
  var eircode = req.body.eircode;
  // Check that all fields exist
  if (!firstName || !lastName || !email || !phoneNumber || !eircode) {
    console.log("Missing one or more required fields.");
    return res.status(400).send("Please fill in all fields.");
  }
  // Validate the form data
  const nameRegex = /^[a-zA-Z0-9]{1,20}$/;
  const phoneRegex = /^[0-9]{10}$/;
  const eircodeRegex = /^[0-9][a-zA-Z0-9]{5}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !nameRegex.test(firstName) ||
    !nameRegex.test(lastName) ||
    !emailRegex.test(email) ||
    !phoneRegex.test(phoneNumber) ||
    !eircodeRegex.test(eircode)
  ) {
    return res.status(400).send("Invalid data submitted.");
  }

  // Insert the form data into the MySQL table
  var sql =
    "INSERT INTO mysql_table (first_name, last_name, email, phone_number, eircode)VALUES (?, ?, ?, ?, ?)"; // SQL query in a variable

  // Execute the SQL query
  connection.query(
    sql,
    [firstName, lastName, email, phoneNumber, eircode],
    function (err, result) {
      if (err) {
        console.log("Error inserting data:", err.message);
        return res.status(500).send("Database error.");
      }
      console.log("Data inserted successfully into MySQL table.");
      res.redirect("/?success=true"); // Send a response after the submit
    }
  );
});
// SERVER STARTUP
// ===============================

// Start the server on port 3000
const server = app.listen(3000, function () {
  // Connect to the database when the server starts
  connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL Database!");
  });

  console.log("Server is running on http://localhost:3000"); // Log a message
});

//Showing a message is the connection server faild
server.on("error", (err) => {
  console.error("Server failed to start:", err.message);
});
