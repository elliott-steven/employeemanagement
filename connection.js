var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "abcd1234",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("You are connect using id " + connection.threadId);
});

module.exports = connection