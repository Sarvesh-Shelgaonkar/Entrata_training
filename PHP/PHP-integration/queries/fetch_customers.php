<?php
/**
 * Fetch all customers from the database
 */
require_once __DIR__ . '/../connection/odbc_connection.php';

// Connect
$db_conn = get_db_connection();

// SQL Query to select all customers
$sql_query = "SELECT * FROM customers ORDER BY full_name ASC";
$res = odbc_exec($db_conn, $sql_query);

$customer_list = [];

while ($data = odbc_fetch_array($res)) {
    // Add row to the list
    $customer_list[] = $data;
}

// Display result
echo "<h3>Customer List:</h3>";
echo "<pre>";
print_r($customer_list);
echo "</pre>";

// Cleanup
odbc_close($db_conn);
?>
