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

//Prompts to begin app
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
                    addDepartment();
                    break

                case options[5]:
                    addRole();
                    break

                case options[6]:
                    addEmp();
                    break

                case options[7]:
                    connection.end();
                    break
            }
        })
}

// View ALL Departments
function viewDepartment() {
    connection.query("SELECT * FROM department", function (err, answer) {
        console.table(answer);
    });
    search();
}

// View ALL Employees
function viewEmp() {

    var sqlQuery = "SELECT first_name, last_name, title, salary FROM employee ";
    sqlQuery += "LEFT JOIN role ";
    sqlQuery += "ON employee.role_id = role.id"
    connection.query(sqlQuery, function (err, result) {
        if (err) throw err;

        console.table(result)
        search();
    });
}

// View ALL Roles
function viewRole() {
    var sqlQuery = "SELECT * FROM role";
    connection.query(sqlQuery, function (err, result) {
        if (err) throw err;

        console.table(result)
        search();
    })
}

// Select Role used in Add Employee Prompt
var roleArr = [];
function selectRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }

    })
    return roleArr;
}

// Select Manager used in Add Employee Prompt
var managersArr = [];
function selectManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            managersArr.push(res[i].first_name);
        }

    })
    return managersArr;
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

// Add Department Prompts
function addDepartment() { 

    inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "What Department would you like to add?"
        }
    ]).then(function(res) {
        var query = connection.query(
            "INSERT INTO department SET ? ",
            {
              name: res.name
            },
            function(err) {
                if (err) throw err
                console.table(res);
                search();
            }
        )
    })
  }

// Add Employee Prompt
function addEmp() {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Enter their first name "
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter their last name "
        },
        {
            name: "role",
            type: "list",
            message: "What is their role? ",
            choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Whats their managers name?",
            choices: selectManager()
        }
    ]).then(function (val) {
        var roleId = selectRole().indexOf(val.role) + 1
        var managerId = selectManager().indexOf(val.choice) + 1
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: val.firstName,
                last_name: val.lastName,
                manager_id: managerId,
                role_id: roleId

            }, function (err) {
                if (err) throw err
                console.table(val)
                search()
            })

    })
}