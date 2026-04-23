# PHP Database and Storage

This section focuses on data persistence—how to store and retrieve data using both relational databases and the local file system.

## 1. Database Interaction (PDO)
PDO (PHP Data Objects) is a consistent interface for accessing many different databases.
- **Connection**: `new PDO("mysql:host=localhost;dbname=test", $user, $pass)`.
- **Prepared Statements**: Crucial for security as they prevent SQL Injection.
- **`fetchAll()`**: Retrieves all rows from a query.

## 2. File Handling
PHP allows you to read from and write to files on the server.
- **`fopen()` / `fclose()`**: Opening and closing a file stream.
- **`fwrite()`**: Writing data to a file.
- **`file_get_contents()`**: Quick way to read an entire file into a string.
- **`file_put_contents()`**: Quick way to write data to a file.

## 3. Environment Configuration
Storing sensitive database credentials in a separate file (like `.env` or `config.php`) and including it as needed.
