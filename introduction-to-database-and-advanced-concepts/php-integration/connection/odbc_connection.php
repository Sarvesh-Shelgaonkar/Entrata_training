<?php
/**
 * ODBC Connection Helper
 * Provides a centralized way to establish a database connection.
 */
require_once __DIR__ . '/../config/db_config.php';

function get_db_connection() {
    // Attempt to establish connection using DSN constants from db_config
    $resource = odbc_connect(DB_DSN, DB_USER, DB_PASS);

    if (!$resource) {
        // Stop execution if connection fails
        die("Critical Error: Database connection failed. " . odbc_errormsg());
    }

    return $resource;
}
?>
