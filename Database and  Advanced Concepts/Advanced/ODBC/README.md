# ODBC (Open Database Connectivity)

ODBC is a standard Application Programming Interface (API) for accessing database management systems (DBMS). It is designed to be independent of database systems and operating systems.

## How ODBC Works
ODBC acts as a middle layer (driver) between an application and the DBMS. This allows an application to use the same code to access different databases (like PostgreSQL, MySQL, SQL Server) by just changing the ODBC driver.

## Key Components
1.  **Application**: Calls ODBC functions to connect and execute SQL.
2.  **Driver Manager**: Loads the appropriate driver for the database.
3.  **Driver**: Processes ODBC function calls and submits requests to the specific DBMS.
4.  **Data Source (DSN)**: A configuration that stores the connection details (Server, Database, User, Port).

## Advantages
- **Interoperability**: One application can access multiple different databases.
- **Abstraction**: The developer doesn't need to know the specific native API of the database.
- **Standardization**: Uses a standard set of functions and SQL syntax.
