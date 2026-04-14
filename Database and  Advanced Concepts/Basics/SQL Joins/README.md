# SQL Joins

A JOIN clause is used to combine rows from two or more tables, based on a related column between them.

## Types of SQL Joins

1.  **INNER JOIN**: Returns records that have matching values in both tables.
2.  **LEFT (OUTER) JOIN**: Returns all records from the left table, and the matched records from the right table. If no match, NULL is returned for the right table.
3.  **RIGHT (OUTER) JOIN**: Returns all records from the right table, and the matched records from the left table. If no match, NULL is returned for the left table.
4.  **FULL (OUTER) JOIN**: Returns all records when there is a match in either left or right table.
5.  **CROSS JOIN**: Returns the Cartesian product of the two tables.

## Practical Usage
In our **Customer-Purchase** database:
- We use INNER JOIN to see which customers have made purchases.
- We use LEFT JOIN to see all customers, even those who haven't bought anything yet.
