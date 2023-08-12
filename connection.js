const mysql = require('mysql');

const db = mysql.createConnection({
    host: "bltuwta8cimctyfo6q3a-mysql.services.clever-cloud.com",
    user: "umg9c0iivuva11n4",
    password: "OI4nvvY1ebht53zNKwVg",
    database: "bltuwta8cimctyfo6q3a"
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

db.on('error', (err) => {
    console.error('Database error:', err);
});

module.exports = db;
