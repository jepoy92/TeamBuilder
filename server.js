
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
            "view all roles",
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

            case "view all departments":
                viewDepartments()
                break;
            
            case "view all roles":
                viewRole()
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

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, data) {
        console.table(data);
        askQuestions();
    })
}

function viewRole() {
    connection.query(
        "SELECT first_name, last_name, title, salary FROM employee JOIN current_role ON role_id = current_role.id",
        function (err, response) {
            if (err) throw err;
            console.table(response);
            askQuestions();
        }
    )
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
    ]).then(function(response) {
        if (response.managerId) {
        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [response.firstName, response.lastName, response.roleId, response.managerId], function(err, data) {
            if (err) throw err;
            console.table("Successfully updated!");
            askQuestions();
        })
    } else {
        connection.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)', [response.firstName, response.lastName, response.roleId], function(err, data) {
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
        message: "What department do you want to add?"
    }, ]).then(function(response) {
        connection.query('INSERT INTO department (current_name) VALUES (?)', [response.department], function(err, data) {
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
        connection.query("INSERT INTO current_role (title, salary, department_id) values (?, ?, ?)", [response.title, response.salary, response.department_id], function (err, data) {
        })
        askQuestions();
    })

}

function updateEmployeeRole() {
    connection
      .query("SELECT current_role.id, current_role.title FROM current_role", (err, response) => {
        if (err) {
          throw err;
        }
        const roles = response.map((row) => {
          return {
            name: row.title,
            value: row.id,
          };
        });
        connection.query(
          "SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS currentEmployee, employee.id FROM employee",
          (err, response) => {
            if (err) {
              throw err;
            }
            const employees = response.map((element) => {
              return {
                name: element.currentEmployee,
                value: element.id,
              };
            });
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "employeeSelect",
                  message: "Whose role would you like to update?",
                  choices: employees,
                },
                {
                  type: "list",
                  name: "roleSelect",
                  message: "What is their new role?",
                  choices: roles,
                },
              ])
              .then((answers) => {
                connection.query(
                  "UPDATE employee SET employee.role_id = ? WHERE employee.id = ?;",
                  [
                    answers.roleSelect,
                    answers.employeeSelect,
                  ],
                  (err, response) => {
                    if (err) {
                      throw err;
                    }
                    askQuestions();
                  }
                );
              });
          }
        );
      });
  }
  