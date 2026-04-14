-- ============================================
-- SQL Joins: Combining Data from Multiple Tables
-- ============================================

-- 1. INNER JOIN
-- Only customers who have made at least one purchase
SELECT c.full_name, p.total_bill, p.order_status
FROM customers c
INNER JOIN purchases p
ON c.cust_id = p.customer_id;

-- 2. LEFT JOIN
-- List all customers, and their purchase amounts (if any)
SELECT c.full_name, COALESCE(p.total_bill, 0) AS total_bill
FROM customers c
LEFT JOIN purchases p
ON c.cust_id = p.customer_id;

-- 3. RIGHT JOIN
-- List all purchases, and the customer names (even if a customer is deleted)
SELECT c.full_name, p.total_bill, p.purchase_time
FROM customers c
RIGHT JOIN purchases p
ON c.cust_id = p.customer_id;

-- 4. JOIN WITH GROUP BY (Aggregation)
-- Total money spent by each customer
SELECT c.full_name, SUM(p.total_bill) AS total_spent
FROM customers c
JOIN purchases p ON c.cust_id = p.customer_id
GROUP BY c.full_name;

-- Count number of purchases per customer
SELECT c.full_name, COUNT(p.purchase_id) AS purchase_count
FROM customers c
LEFT JOIN purchases p ON c.cust_id = p.customer_id
GROUP BY c.full_name
ORDER BY purchase_count DESC;
