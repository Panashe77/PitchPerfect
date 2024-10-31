const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Explicitly state no username
    password: '',  // Explicitly state no password
    database: 'fawsl',
    port: 3306  // Specify the XAMPP port
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the fawsl database');
});

module.exports = db;
