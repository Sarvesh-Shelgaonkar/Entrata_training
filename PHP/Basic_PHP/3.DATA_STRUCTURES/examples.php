<?php
/**
 * PHP Data Structures: Arrays
 * Theme: Corporate Employee Directory
 */

// 1. Indexed Array: Departments
$departments = ["Engineering", "Marketing", "Human Resources", "Finance", "Sales"];

// 2. Associative Array: Single Employee Profile
$primary_employee = [
    "emp_id" => "E101",
    "name" => "Siddharth Malhotra",
    "position" => "Senior Developer",
    "email" => "siddharth.m@corp.com"
];

// 3. Multidimensional Array: Team List
$team_members = [
    [
        "id" => 1,
        "full_name" => "Rohan Joshi",
        "role" => "UI Designer",
        "active" => true
    ],
    [
        "id" => 2,
        "full_name" => "Kavita Singh",
        "role" => "Backend Dev",
        "active" => true
    ],
    [
        "id" => 3,
        "full_name" => "Amit Trivedi",
        "role" => "Project Manager",
        "active" => false
    ]
];

// Array Manipulation
array_push($departments, "Legal"); // Adding new department
sort($departments); // Alphabetical sort

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Employee Directory</title>
</head>
<body>
    <h1>Company Hierarchy</h1>

    <h3>Departments (Sorted):</h3>
    <ol>
        <?php foreach ($departments as $dept): ?>
            <li><?php echo $dept; ?></li>
        <?php endforeach; ?>
    </ol>

    <hr>

    <h3>Active Team Members:</h3>
    <ul>
        <?php foreach ($team_members as $member): ?>
            <?php if ($member['active']): ?>
                <li>
                    <strong><?php echo $member['full_name']; ?></strong> 
                    - <?php echo $member['role']; ?>
                </li>
            <?php endif; ?>
        <?php endforeach; ?>
    </ul>

    <hr>

    <h3>Profile Preview:</h3>
    <p>ID: <?php echo $primary_employee['emp_id']; ?></p>
    <p>Name: <?php echo $primary_employee['name']; ?></p>
    <p>Contact: <?php echo $primary_employee['email']; ?></p>

</body>
</html>
