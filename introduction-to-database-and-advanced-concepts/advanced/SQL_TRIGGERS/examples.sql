-- ============================================
-- SQL Triggers: Automated Auditing System
-- ============================================

-- Create an Audit Table
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    reference_id INT,
    event_type VARCHAR(50) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1. INSERT TRIGGER (NEW PURCHASE)
-- ================================

CREATE OR REPLACE FUNCTION audit_new_purchase()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs(reference_id, event_type)
    VALUES (NEW.purchase_id, 'NEW_PURCHASE_RECORDED');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_purchase_insert
AFTER INSERT ON purchases
FOR EACH ROW
EXECUTE FUNCTION audit_new_purchase();

-- 2. UPDATE TRIGGER (BILL UPDATED)
-- ================================

CREATE OR REPLACE FUNCTION audit_purchase_update()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs(reference_id, event_type)
    VALUES (NEW.purchase_id, 'PURCHASE_DETAILS_MODIFIED');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_purchase_update
AFTER UPDATE ON purchases
FOR EACH ROW
EXECUTE FUNCTION audit_purchase_update();

-- 3. DELETE TRIGGER (PURCHASE REMOVED)
-- ===================================

CREATE OR REPLACE FUNCTION audit_purchase_delete()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs(reference_id, event_type)
    VALUES (OLD.purchase_id, 'PURCHASE_DELETED');

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_purchase_delete
AFTER DELETE ON purchases
FOR EACH ROW
EXECUTE FUNCTION audit_purchase_delete();
