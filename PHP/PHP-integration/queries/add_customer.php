<?php
/**
 * Add a new customer to the database
 */
require_once __DIR__ . '/../connection/odbc_connection.php';

// Get database connection
$conn_res = get_db_connection();

// New customer details
$customer_name  = "Vijay Kumar";
$customer_email = "vijay.k@mail.com";

// SQL INSERT statement
$insert_sql = "INSERT INTO customers (full_name, email_address) VALUES ('$customer_name', '$customer_email')";

$success = odbc_exec($conn_res, $insert_sql);

if ($success) {
    echo "Success: New customer record created successfully.";
} else {
    echo "Error: Record insertion failed. Check DSN or table structure.";
}

// Close
odbc_close($conn_res);
?>
