<?php
/**
 * PHP Database and Storage
 * Theme: Resource Catalog and Access Logging
 */

// 1. Database Connection (PDO)
$db_config = [
    'host' => 'localhost',
    'user' => 'root',
    'pass' => 'password',
    'name' => 'inventory_db'
];

function connect_via_pdo($cfg) {
    try {
        $dsn = "mysql:host={$cfg['host']};dbname={$cfg['name']};charset=utf8mb4";
        // Note: This won't run without a local DB, but illustrates the pattern
        // $pdo = new PDO($dsn, $cfg['user'], $cfg['pass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        // return $pdo;
        return null; // Mocking for now
    } catch (PDOException $e) {
        log_db_error($e->getMessage());
        return null;
    }
}

// 2. File Handling: Error Logging
function log_db_error($msg) {
    $timestamp = date("Y-m-d H:i:s");
    $log_entry = "[$timestamp] ERROR: $msg" . PHP_EOL;
    file_put_contents("app_activity.log", $log_entry, FILE_APPEND);
}

// 3. Simulated Data Retrieval
$catalog_items = [
    ["id" => 1, "name" => "Technical Manual v2", "format" => "PDF"],
    ["id" => 2, "name" => "Project Blueprint", "format" => "DWG"],
    ["id" => 3, "name" => "API Documentation", "format" => "HTML"]
];

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Resource Catalog</title>
</head>
<body>
    <h1>Digital Resource Catalog</h1>
    
    <table border="1" cellpadding="10">
        <tr>
            <th>ID</th>
            <th>Resource Name</th>
            <th>File Format</th>
        </tr>
        <?php foreach ($catalog_items as $item): ?>
            <tr>
                <td><?php echo $item['id']; ?></td>
                <td><?php echo $item['name']; ?></td>
                <td><?php echo $item['format']; ?></td>
            </tr>
        <?php endforeach; ?>
    </table>

    <hr>
    <p><small>System Status: Database connection simulated. Activity is being logged to <em>app_activity.log</em>.</small></p>

</body>
</html>
