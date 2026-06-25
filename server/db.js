// ================================================================
// db.js — MySQL connection pool (mysql2/promise)
// ================================================================
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST || "127.0.0.1",
  port:     parseInt(process.env.DB_PORT || "3306", 10),
  user:     process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "srinivasa_medicals",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Return rows as plain objects (not RowDataPacket)
  typeCast: true,
});

module.exports = pool;
