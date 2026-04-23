# SQL Basics

SQL (Structured Query Language) is the standard language for relational database management systems. This section covers the core operations known as CRUD (Create, Read, Update, Delete) and basic database schema creation.

## 1. DDL (Data Definition Language)
These commands are used to define the database structure (schema).
- `CREATE`: To create databases, tables, etc.
- `ALTER`: To modify the structure.
- `DROP`: To delete tables or databases.

## 2. DML (Data Manipulation Language)
These commands are used to manage data within the tables.
- `INSERT`: To add new records.
- `SELECT`: To retrieve data.
- `UPDATE`: To modify existing records.
- `DELETE`: To remove records.

## 3. Constraints
Constraints ensure the data integrity in the database.
- `PRIMARY KEY`: Uniquely identifies each record.
- `FOREIGN KEY`: Links two tables together.
- `NOT NULL`: Ensures a column cannot have a NULL value.
- `UNIQUE`: Ensures all values in a column are different.
- `CHECK`: Ensures the value in a column meets a specific condition.

## Practice Schema
We use a simple **Customer-Purchase** system for our examples.
- `customers`: Stores information about people.
- `purchases`: Stores details about what they bought.
