const mysql = require('mysql2/promise');
require('dotenv').config();

// XAMPP default configuration
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'local_billing_db';

let pool = null;

// Auto-configure database and tables
async function autoConfigureDatabase() {
  let connection = null;
  
  try {
    console.log('🔄 Starting automatic database configuration...');
    
    // Step 1: Connect to MySQL server without specifying a database
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD
    });
    
    console.log('✅ Connected to MySQL server');
    
    // Step 2: Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`✅ Database '${DB_NAME}' created/verified`);
    
    // Close the initial connection
    await connection.end();
    
    // Step 3: Create connection pool to the specific database
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    // Step 4: Get connection from pool and create tables
    const poolConnection = await pool.getConnection();
    
    // Create clients table with indexes
    await poolConnection.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL UNIQUE,
        balance DECIMAL(10, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_phone (phone),
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log('✅ Table "clients" created/verified');
    
    // Create transactions table with ledger columns
    await poolConnection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        type ENUM('INCOME', 'EXPENSE', 'DUE') NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        paid_amount DECIMAL(10, 2) DEFAULT 0.00,
        current_due DECIMAL(10, 2) DEFAULT 0.00,
        previous_due DECIMAL(10, 2) DEFAULT 0.00,
        total_due DECIMAL(10, 2) DEFAULT 0.00,
        description TEXT,
        whatsapp_status ENUM('SENT', 'FAILED', 'PENDING') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
        INDEX idx_client_id (client_id),
        INDEX idx_type (type),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log('✅ Table "transactions" created/verified');
    
    // Create settings table (without TEXT defaults for production compatibility)
    await poolConnection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        business_name VARCHAR(255) DEFAULT 'Sajib Digital hub',
        business_phone VARCHAR(20) DEFAULT '',
        business_address TEXT,
        header_text TEXT,
        footer_text TEXT,
        logo_path VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log('✅ Table "settings" created/verified');
    
    // Insert default settings if not exists (with explicit values)
    const [settingsCheck] = await poolConnection.query('SELECT COUNT(*) as count FROM settings');
    if (settingsCheck[0].count === 0) {
      await poolConnection.query(`
        INSERT INTO settings (business_name, business_phone, business_address, header_text, footer_text)
        VALUES ('Sajib Digital hub', '', '', 'ধন্যবাদ আমাদের সেবা নেওয়ার জন্য', 'আবার আসবেন 🙏');
      `);
      console.log('✅ Default settings inserted');
    }
    
    // Create bill_items table
    await poolConnection.query(`
      CREATE TABLE IF NOT EXISTS bill_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        transaction_id INT NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        rate DECIMAL(10, 2) NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
        INDEX idx_transaction_id (transaction_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log('✅ Table "bill_items" created/verified');
    
    // Create trial_tracking table (for free trial system)
    await poolConnection.query(`
      CREATE TABLE IF NOT EXISTS trial_tracking (
        id INT AUTO_INCREMENT PRIMARY KEY,
        machine_id VARCHAR(255) NOT NULL UNIQUE,
        machine_hash VARCHAR(255) NOT NULL,
        trial_started_at TIMESTAMP NOT NULL,
        trial_expires_at TIMESTAMP NOT NULL,
        is_activated BOOLEAN DEFAULT FALSE,
        license_key VARCHAR(255) DEFAULT NULL,
        activated_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_machine_id (machine_id),
        INDEX idx_machine_hash (machine_hash)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log('✅ Table "trial_tracking" created/verified');
    
    poolConnection.release();
    
    console.log('🎉 Database & Tables auto-configured successfully\n');
    return true;
    
  } catch (error) {
    console.error('❌ Database auto-configuration failed:', error.message);
    if (connection) {
      await connection.end();
    }
    throw error;
  }
}

// Get the pool instance
function getPool() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call autoConfigureDatabase() first.');
  }
  return pool;
}

module.exports = {
  autoConfigureDatabase,
  getPool
};
