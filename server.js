
const mysql = require("mysql");
// const Department = require("./lib/department");
// const Employee = require("./lib/employee");
// const Role = require("./lib/role");
const inquirer = require("inquirer");
// const cTable = require('console.table');



var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // password
    password: "root",
    database: "employeeDB"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // manageEmployees();
    
  });