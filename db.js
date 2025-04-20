// db.js
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost', // Database host
    user: 'root', // Database username
    password: 'Hurrah@1312', // Database password
    database: 'optfood' // Database name
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as ID', connection.threadId);
});

module.exports = connection; // Export the connection for use in other files