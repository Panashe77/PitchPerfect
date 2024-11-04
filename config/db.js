const mysql = require("mysql");

// Create a MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',    // Use environment variable or default to 'localhost'
    port: process.env.DB_PORT || 3306,           // Default to port 3306
    user: process.env.DB_USER || 'root',         // Use environment variable or default to 'root'
    password: process.env.DB_PASSWORD || '',     // Use environment variable or default to empty string
    database: process.env.DB_NAME || 'fawsl'     // Use environment variable or default to 'fawsl'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the database");
});

// Export the database connection
module.exports = db;
