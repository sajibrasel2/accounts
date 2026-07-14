-- =========================================================
-- POS BILLING SYSTEM - PRODUCTION DATABASE SCHEMA
-- Compatible with strict SQL mode on production servers
-- Database: techandc_accounts
-- =========================================================

-- Set character set for the session
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================
-- Table: clients
-- Purpose: Store customer/client information
-- =========================================================

-- Drop table if exists to recreate properly
DROP TABLE IF EXISTS `clients`;

CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `balance` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  KEY `idx_phone` (`phone`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- Table: transactions
-- Purpose: Store all billing transactions with ledger system
-- =========================================================

-- Drop table if exists to recreate properly
DROP TABLE IF EXISTS `transactions`;

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `type` enum('INCOME','EXPENSE','DUE') NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `paid_amount` decimal(10,2) DEFAULT 0.00,
  `current_due` decimal(10,2) DEFAULT 0.00,
  `previous_due` decimal(10,2) DEFAULT 0.00,
  `total_due` decimal(10,2) DEFAULT 0.00,
  `description` text,
  `whatsapp_status` enum('SENT','FAILED','PENDING') DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_client_id` (`client_id`),
  KEY `idx_type` (`type`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- Table: bill_items
-- Purpose: Store individual items for each bill/transaction
-- =========================================================

-- Drop table if exists to recreate properly
DROP TABLE IF EXISTS `bill_items`;

CREATE TABLE `bill_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `transaction_id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `rate` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_transaction_id` (`transaction_id`),
  CONSTRAINT `bill_items_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- Table: settings
-- Purpose: Store business settings and configuration
-- Note: TEXT columns don't have defaults (strict mode compatible)
-- =========================================================

-- Drop table if exists to recreate properly
DROP TABLE IF EXISTS `settings`;

CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_name` varchar(255) DEFAULT 'Sajib Digital hub',
  `business_phone` varchar(20) DEFAULT '',
  `business_address` text,
  `header_text` text,
  `footer_text` text,
  `logo_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default settings
INSERT INTO `settings` (`business_name`, `business_phone`, `business_address`, `header_text`, `footer_text`) 
VALUES ('Sajib Digital hub', '', '', 'ধন্যবাদ আমাদের সেবা নেওয়ার জন্য', 'আবার আসবেন 🙏');

-- =========================================================
-- Table: trial_tracking
-- Purpose: Track free trial usage by machine ID
-- =========================================================

-- Drop table if exists to recreate properly
DROP TABLE IF EXISTS `trial_tracking`;

CREATE TABLE `trial_tracking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `machine_id` varchar(255) NOT NULL,
  `machine_hash` varchar(255) NOT NULL,
  `trial_started_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `trial_expires_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_activated` tinyint(1) DEFAULT 0,
  `license_key` varchar(255) DEFAULT NULL,
  `activated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `machine_id` (`machine_id`),
  KEY `idx_machine_id` (`machine_id`),
  KEY `idx_machine_hash` (`machine_hash`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- Re-enable foreign key checks
-- =========================================================
SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- Verification Queries
-- =========================================================
-- Run these to verify tables were created successfully:
-- SHOW TABLES;
-- DESCRIBE clients;
-- DESCRIBE transactions;
-- DESCRIBE bill_items;
-- DESCRIBE settings;
-- DESCRIBE trial_tracking;
-- SELECT * FROM settings;

-- =========================================================
-- SUCCESS!
-- =========================================================
-- ✅ All tables created successfully
-- ✅ Compatible with strict SQL mode
-- ✅ Foreign keys configured
-- ✅ Indexes added for performance
-- ✅ Default settings inserted
-- 
-- Next step: Start your application with "node server.js"
-- =========================================================
