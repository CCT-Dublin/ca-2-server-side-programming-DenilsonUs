/**
 * CA2 - Part A: CSV Validation and Database Insertion
 */

const fs = require("fs");
const db = require("./Model/db_ca2.js");

// CSV file path (convert XLSX to CSV first)
const filePath = "./Personal_information.csv";

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegEx.test(email);
}

/**
 * Validate one record
 */
function validateRecord(record) {
  const errors = [];

  if (!/^[a-zA-Z0-9]{1,20}$/.test(record.first_name)) {
    errors.push("invalid first_name");
  }

  if (!/^[a-zA-Z0-9]{1,20}$/.test(record.second_name)) {
    errors.push("invalid second_name");
  }

  if (!isValidEmail(record.email)) {
    errors.push("invalid email");
  }

  if (!/^[0-9]{10}$/.test(record.phone_number)) {
    errors.push("invalid phone_number");
  }

  if (!/^[0-9][A-Za-z0-9]{5}$/.test(record.eircode)) {
    errors.push("invalid eircode");
  }

  return errors;
}

/**
 * Process CSV data using string handling (same as class)
 */
function processCSVData(csvData) {
  const rows = csvData.split("\n").filter((line) => line.trim() !== "");

  rows.slice(1).forEach((row, index) => {
    const rowNumber = index + 1;
    const columns = row.split(",");

    if (columns.length !== 5) {
      console.error(`Row ${rowNumber} error: incorrect column count`);
      return;
    }

    const record = {
      first_name: columns[0].replace(/"/g, "").trim(),
      second_name: columns[1].replace(/"/g, "").trim(),
      email: columns[2].replace(/"/g, "").trim().toLowerCase(),
      phone_number: columns[3].replace(/"/g, "").trim(),
      eircode: columns[4].replace(/"/g, "").trim().toUpperCase(),
    };

    const errors = validateRecord(record);

    if (errors.length > 0) {
      console.error(`Row ${rowNumber} invalid: ${errors.join("; ")}`);
      return;
    }

    insertRecord(record, rowNumber);
  });
}

/**
 * Insert valid record into database
 */
function insertRecord(record, rowNumber) {
  const sql = `
    INSERT INTO mysql_table
    (first_name, second_name, email, phone_number, eircode)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.execute(
    sql,
    [
      record.first_name,
      record.second_name,
      record.email,
      record.phone_number,
      record.eircode,
    ],
    (err) => {
      if (err) {
        console.error(`Row ${rowNumber} DB error: ${err.message}`);
        return;
      }
      console.log(`Row ${rowNumber} inserted successfully`);
    }
  );
}

// Read CSV file
fs.readFile(filePath, "utf-8", (err, data) => {
  if (err) {
    console.error("Cannot read CSV file:", err.message);
    return;
  }

  console.log("Starting CSV validation...");
  processCSVData(data);
});
