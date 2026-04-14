# SQL Functions

SQL Functions are subprograms that can be used to perform operations and return a value. They are categorized into Built-in (Aggregate) and Custom (User-Defined) functions.

## 1. Aggregate Functions
These functions operate on multiple rows of data and return a single summary value.
- `COUNT()`: Returns the number of rows.
- `SUM()`: Calculates the total sum of a numeric column.
- `AVG()`: Returns the average value.
- `MAX()`: Returns the largest value.
- `MIN()`: Returns the smallest value.

## 2. User-Defined Functions (UDFs)
Custom functions allow you to define your own logic that can be reused across your SQL queries.
- `CREATE FUNCTION`: Keyword to define a new function.
- `RETURNS`: Specifies the data type of the return value.
- `LANGUAGE`: Defines the language used (e.g., `plpgsql` for PostgreSQL).

## Key Benefits
- **Reusability**: Write once, use many times.
- **Maintainability**: Centralize complex logic in a single function.
- **Performance**: Execute operations closer to the data on the server side.
