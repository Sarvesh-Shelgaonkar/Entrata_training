-- ============================================
-- SQL Functions: Aggregate and Custom Examples
-- ============================================

-- 1. AGGREGATE FUNCTIONS
-- ======================

-- Total customers in system
SELECT COUNT(cust_id) AS total_customers FROM customers;

-- Total sales amount
SELECT SUM(total_bill) AS gross_sales FROM purchases;

-- Average purchase value
SELECT AVG(total_bill) AS avg_sale FROM purchases;

-- 2. CUSTOM USER-DEFINED FUNCTIONS
-- ================================

-- Count purchases made by a specific customer
CREATE OR REPLACE FUNCTION count_purchases(cid INT)
RETURNS INT AS $$
DECLARE pcount INT;
BEGIN
    SELECT COUNT(*) INTO pcount
    FROM purchases
    WHERE customer_id = cid;

    RETURN pcount;
END;
$$ LANGUAGE plpgsql;

-- Usage
SELECT count_purchases(1);

-- Calculate total spending for a specific customer
CREATE OR REPLACE FUNCTION calc_customer_spend(cid INT)
RETURNS DECIMAL AS $$
DECLARE total_spent DECIMAL;
BEGIN
    SELECT COALESCE(SUM(total_bill), 0) INTO total_spent
    FROM purchases
    WHERE customer_id = cid;

    RETURN total_spent;
END;
$$ LANGUAGE plpgsql;

-- Usage
SELECT calc_customer_spend(1);

-- Check if customer qualifies for VIP status (spent more than 1000)
CREATE OR REPLACE FUNCTION is_vip_customer(cid INT)
RETURNS BOOLEAN AS $$
DECLARE spent DECIMAL;
BEGIN
    SELECT COALESCE(SUM(total_bill), 0) INTO spent
    FROM purchases
    WHERE customer_id = cid;

    RETURN spent > 1000.00;
END;
$$ LANGUAGE plpgsql;

-- Usage
SELECT is_vip_customer(1);
