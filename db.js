const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    database: 'fawsl'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the fawsl database');
});

module.exports = db;
