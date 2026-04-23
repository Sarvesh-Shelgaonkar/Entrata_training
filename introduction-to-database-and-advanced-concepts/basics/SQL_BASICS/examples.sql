-- ============================================
-- SQL Basics: Schema and CRUD Operations
-- ============================================

-- 1. Create Schema
CREATE TABLE customers (
    cust_id SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email_address VARCHAR(150) UNIQUE NOT NULL,
    joined_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE purchases (
    purchase_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    total_bill DECIMAL(12,2) CHECK (total_bill > 0),
    order_status VARCHAR(30) DEFAULT 'Processing',
    purchase_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_customer_id
        FOREIGN KEY(customer_id)
        REFERENCES customers(cust_id)
        ON DELETE CASCADE
);

-- 2. Basic CRUD Operations

-- INSERT: Adding records
INSERT INTO customers (full_name, email_address)
VALUES ('Amit Sharma', 'amit.s@example.com'),
       ('Suresh Raina', 'suresh.r@example.com'),
       ('Deepa Kumari', 'deepa.k@example.com');

INSERT INTO purchases (customer_id, total_bill, order_status)
VALUES (1, 1500.50, 'Delivered'),
       (1, 450.00, 'Processing'),
       (2, 2100.00, 'Delivered');

-- SELECT: Reading data
-- Fetch all customers
SELECT * FROM customers;

-- Fetch specific columns with alias
SELECT full_name AS Name, email_address AS Email FROM customers;

-- UPDATE: Modifying data
UPDATE customers
SET full_name = 'Amit V. Sharma'
WHERE cust_id = 1;

-- DELETE: Removing data
DELETE FROM purchases
WHERE purchase_id = 2;

-- 3. Filtering and Sorting
-- Get high-value purchases
SELECT * FROM purchases
WHERE total_bill > 1000;

-- Sort customers by name
SELECT * FROM customers
ORDER BY full_name ASC;
