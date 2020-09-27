INSERT INTO department (current_name)
VALUES ("Human Resources");
INSERT INTO department (current_name)
VALUES ("Sales");
INSERT INTO department (current_name)
VALUES ("Marketing");
INSERT INTO department (current_name)
VALUES ("Finances");
INSERT INTO department (current_name)
VALUES ("Legal");

-- Insert rows into table 'role'
INSERT INTO current_role (title, salary, department_id)
VALUES
( 
 "Lawyer", 160000, 5
),
( 
 "Accountant", 145000, 4
),
( 
 "Marketing Manager", 135000, 3
),
( 
 "Sales clerk", 100000, 2
),
( 
 "HR Manager", 85000, 1
);

-- Insert rows into table 'employee'
INSERT INTO employee
( -- columns to insert data into
 first_name, last_name, role_id, manager_id
)
VALUES
( 
 "Jim", "Jones", 1, NULL
),
( 
 "Jane", "Jones", 2, 1
),
( 
 "John", "Jones", 3, NULL
),
( 
 "Joan", "Jones", 4, NULL
),
( 
 "James", "Jones", 5, NULL
);