# SQL Triggers

A SQL Trigger is a special type of stored procedure that automatically runs when an event occurs in the database server. Triggers are mainly used for maintaining data integrity and auditing.

## How Triggers Work
Triggers are executed in response to one of the following events:
- `INSERT`: Triggered when a new row is added.
- `UPDATE`: Triggered when an existing row is modified.
- `DELETE`: Triggered when a row is removed.

## Trigger Timing
- `BEFORE`: Execute before the actual DML operation.
- `AFTER`: Execute after the DML operation is successfully completed.

## Use Cases
1.  **Auditing**: Recording changes made to tables for security or tracking.
2.  **Data Validation**: Checking values before they are inserted.
3.  **Automatic Updates**: Updating a related table automatically (e.g., stock levels).
4.  **Enforcing Business Rules**: Ensuring complex logic that constraints cannot handle.
