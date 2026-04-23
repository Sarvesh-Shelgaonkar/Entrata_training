<?php
/**
 * ODBC Database Connection Example
 * This demonstrates how to connect to a database using an ODBC DSN.
 */

// Connection parameters
$dsn_name = "MyLocalPostgresDSN";
$db_user  = "db_admin";
$db_pass  = "secure_pass123";

/**
 * Creates and returns an ODBC connection resource.
 */
function create_odbc_connection($dsn, $user, $pass) {
    // Attempt to connect via ODBC
    $resource = odbc_connect($dsn, $user, $pass);

    if (!$resource) {
        // Log error and terminate if connection fails
        $error_msg = odbc_errormsg();
        error_log("ODBC Error: " . $error_msg);
        die("Connection to database failed. Please check DSN settings.");
    }

    return $resource;
}

// Establish the connection
$db_conn = create_odbc_connection($dsn_name, $db_user, $db_pass);

echo "Successfully connected to database via ODBC!";

// Always close the connection when finished
odbc_close($db_conn);
?>
