-- Database Schema for Inventory Management System

-- Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    sku VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Create Stock Transactions Table
CREATE TABLE IF NOT EXISTS stock_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    type ENUM('IN', 'OUT') NOT NULL,
    quantity INT NOT NULL,
    notes TEXT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Initial Data
INSERT IGNORE INTO categories (name, description) VALUES 
('Electronics', 'Gadgets, devices and hardware'),
('Furniture', 'Office and home furniture'),
('Stationery', 'Pens, paper and office supplies');

INSERT IGNORE INTO products (category_id, sku, name, description, price, stock_quantity) VALUES
(1, 'LAP-DELL-XPS', 'Dell XPS 13', 'High-end ultrabook', 1200.00, 10),
(1, 'MOU-LOG-MX', 'Logitech MX Master 3S', 'Wireless ergonomic mouse', 99.00, 50),
(2, 'CHR-AER-BL', 'Aeron Chair', 'Premium office chair', 1500.00, 5);
