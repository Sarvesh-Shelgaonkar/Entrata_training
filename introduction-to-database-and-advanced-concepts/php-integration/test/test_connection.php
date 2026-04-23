<?php
/**
 * Test Database Connection script
 */
require_once __DIR__ . '/../connection/odbc_connection.php';

// Establish connection
$db_handle = get_db_connection();

if ($db_handle) {
    echo "Connection Check: OK. ODBC Data Source is responding.";
}
?>
