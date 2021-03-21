// Required dependencies
const inquirer = require('inquirer');
const mysql = require('mysql');
const connection = require('./connection');

// Begin CLI part of application
const options = [
    "View ALL Departments",
    "View ALL Roles",
    "View ALL Employees",
    "Update Employee",
    "Add Department",
    "Add Role",
    "Add Employee",
    "exit"
];

const empOptions = [
    "Steven Elliott",
    "Daniel Coleman",
    "David Bandle",
    "exit"
];

search();

function search() {

    inquirer.prompt({
        name: "action",
        type: "list",
        message: "Choose what you would like to do:",
        choices: options
    })

    .then(function (answer) {
        switch (answer.action) {
            case options[0]:
                viewDepartment();
                break;

            case options[1]:
                viewRole();
                break;

            case options[2]:
                viewEmp();
                break;

            case options[3]:
                updEmp();

            case options[4]:
                connection.end();
                break
        }
    })
}
function viewDepartment() {
    var sqlQuery = "SELECT * FROM departments";
    connection.query(sqlQuery, function (err, result) {
        if (err) throw err;

        console.table(result)
        search();
    })
}

function viewEmp() {

    sqlQuery += "LEFT JOIN roles ";
    var sqlQuery = "SELECT first_name, last_name, title, salary FROM employees ";
    
    
    connection.query(sqlQuery, function (err, result) {
        if (err) throw err;

        console.table(result)
        search();
    })
}

function viewRole() {
    var sqlQuery = "SELECT * FROM roles";
    connection.query(sqlQuery, function (err, result) {
        if (err) throw err;

        console.table(result)
        search();
    })
}


const updEmp = () => {

    function updSearch() {
        inquirer
            .prompt({
                name: "action",
                type: "list",
                message: "Which employee do you want to update?",
                choices: empOptions
            })
           
    }
    updSearch();  
}