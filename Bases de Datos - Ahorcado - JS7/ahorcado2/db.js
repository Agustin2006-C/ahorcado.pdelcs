// db.js
const mysql = require('./mysql2');

const connection = mysql.createConnection({
  host: 'localhost',       // o el host que uses
  user: 'root',            // tu usuario de MySQL
  password: 'river2018',            // tu contraseña de MySQL
  database: 'score'        // base de datos que creaste
});

module.exports = connection;
