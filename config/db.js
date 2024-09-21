const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',    // Pastikan ini benar
    user: 'root',         // Pastikan username sesuai
    password: '',  // Ganti dengan password MySQL Anda
    database: 'library_db',     // Pastikan nama database benar
    port: 3306             // Pastikan port default MySQL (3306)
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

module.exports = connection;
