
-- ============================================
-- LinkSnap: Advanced URL Management System
-- Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS link_snap_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE link_snap_db;

CREATE TABLE IF NOT EXISTS snaps (
    id           INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    target_url   TEXT            NOT NULL,
    snap_token   VARCHAR(12)     NOT NULL UNIQUE,
    visit_count  INT UNSIGNED    NOT NULL DEFAULT 0,
    created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
