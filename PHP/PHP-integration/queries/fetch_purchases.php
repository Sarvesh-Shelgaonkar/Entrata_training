<?php
/**
 * Fetch purchase history with customer names
 */
require_once __DIR__ . '/../connection/odbc_connection.php';

// Establish connection
$db_handle = get_db_connection();

// SQL with JOIN
$sql = "SELECT c.full_name, p.total_bill, p.order_status
        FROM customers c
        INNER JOIN purchases p ON c.cust_id = p.customer_id
        WHERE p.order_status = 'Delivered'";

$exec_result = odbc_exec($db_handle, $sql);

echo "<h3>Delivered Purchases Report:</h3>";
echo "<table border='1'>
        <tr>
            <th>Customer Name</th>
            <th>Bill Amount</th>
            <th>Status</th>
        </tr>";

while ($record = odbc_fetch_array($exec_result)) {
    echo "<tr>";
    echo "<td>" . $record['full_name'] . "</td>";
    echo "<td>" . $record['total_bill'] . "</td>";
    echo "<td>" . $record['order_status'] . "</td>";
    echo "</tr>";
}
echo "</table>";

// Close
odbc_close($db_handle);
?>
