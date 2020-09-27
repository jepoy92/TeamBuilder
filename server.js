const mysql = require('mysql');
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "employeeDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    askQuestions();
});

function askQuestions() {
    inquirer.prompt({
        message: "what would you like to do?",
        type: "list",
        choices: [
            "view all employees",
            "view all departments",
            "add employee",
            "add department",
            "add role",
            "update employee role",
            "QUIT"
        ],
        name: "choice"
    }).then(answers => {
        console.log(answers.choice);
        switch (answers.choice) {
            case "view all employees":
                viewEmployees()
                break;
            case "view all roles":
                viewRole()
                break;

            case "view all departments":
                viewDepartments()
                break;

            case "add employee":
                addEmployee()
                break;

            case "add department":
                addDepartment()
                break;

            case "add role":
                addRole()
                break;

            case "update employee role":
                updateEmployeeRole();
                break;

            default:
                connection.end()
                break;
        }
    })
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, data) {
        console.table(data);
        askQuestions();
    })
}

function viewRole() {
    connection.query(
        "SELECT first_name, last_name, title, salary FROM employee JOIN role ON role_id = role.id",
        function (err, response) {
            if (err) throw err;
            console.table(response);
            askQuestions();
        }
    )
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, data) {
        console.table(data);
        askQuestions();
    })
}

function addEmployee() {
    inquirer.prompt([{
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?"
        },
        {
            type: "number",
            name: "roleId",
            message: "What is the employee's role ID"
        },
        {
            type: "number",
            name: "managerId",
            message: "What is the employee manager's ID?"
        }
    ]).then(function(result) {
        if (result.managerId) {
        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [result.firstName, result.lastName, result.roleId, result.managerId], function(err, data) {
            if (err) throw err;
            console.table("Successfully updated!");
            askQuestions();
        })
    } else {
        connection.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)', [result.firstName, result.lastName, result.roleId], function(err, data) {
            if (err) throw err;
            console.table("Successfully updated!");
            askQuestions();
    })
}
    })
}

function addDepartment() {
    inquirer.prompt([{
        type: "input",
        name: "department",
        message: "What is department do you want to add?"
    }, ]).then(function(result) {
        connection.query('INSERT INTO department (name) VALUES (?)', [result.department], function(err, data) {
            if (err) throw err;
            console.table("Successfully updated!");
            askQuestions();
        })
    })
}

function addRole() {
    inquirer.prompt([
        {
            message: "enter title:",
            type: "input",
            name: "title"
        }, {
            message: "enter salary:",
            type: "number",
            name: "salary"
        }, {
            message: "enter department ID:",
            type: "number",
            name: "department_id"
        }
    ]).then(function (response) {
        connection.query("INSERT INTO roles (title, salary, department_id) values (?, ?, ?)", [response.title, response.salary, response.department_id], function (err, data) {
            viewEmployees();
        })
        askQuestions();
    })

}

function updateEmployeeRole() {
    connection.query("SELECT * FROM employee", function(err, response) {
        if (err) throw err;
        var updateEmployee = response.map(function(employee) {
            return employee.first_name + ' ' + employee.last_name
        });

        inquirer        
            .prompt([
                {
                    type: "list",
                    message: "Which employee would you like to update?",
                    name: "employee",
                    choices: updateEmployee
                },
                {
                    type: 'input',
                    message: "What is the new role ID for the employee?",
                    name: "roleId"
                }
            ]).then(function(response) {
                var employeeName = response.employee.split(" ");

                connection.query(`UPDATE employee SET role_id = ${response.role_id} WHERE (first_name = '${employeeName[0]}') AND (last_name = '${employeeName[1]}')`, 
                    function(err, result) {
                   if (err) throw err;
                   viewEmployees();
                })
            })
    })  
}

function viewRole() {
    connection.query(
        "SELECT first_name, last_name, title, salary FROM employee JOIN role ON role_id = role.id",
        function (err, response) {
            if (err) throw err;
            console.table(response);
            askQuestions();
        }
    )
}