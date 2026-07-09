const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'local_billing_db';

async function migrateToLedgerSystem() {
  let connection = null;
  
  try {
    console.log('🔄 Starting migration to Ledger System...\n');
    
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    });
    
    console.log('✅ Connected to database');
    
    // Check if subtotal column already exists
    const [columns] = await connection.query(
      "SHOW COLUMNS FROM transactions LIKE 'subtotal'"
    );
    
    if (columns.length > 0) {
      console.log('✅ Ledger system already installed!');
      console.log('   No migration needed.\n');
      await connection.end();
      return;
    }
    
    console.log('📊 Migrating transactions table...');
    
    // Add new ledger columns
    await connection.query(`
      ALTER TABLE transactions
      ADD COLUMN subtotal DECIMAL(10, 2) DEFAULT 0.00 AFTER type,
      ADD COLUMN paid_amount DECIMAL(10, 2) DEFAULT 0.00 AFTER subtotal,
      ADD COLUMN current_due DECIMAL(10, 2) DEFAULT 0.00 AFTER paid_amount,
      ADD COLUMN previous_due DECIMAL(10, 2) DEFAULT 0.00 AFTER current_due,
      ADD COLUMN total_due DECIMAL(10, 2) DEFAULT 0.00 AFTER previous_due
    `);
    
    console.log('✅ Added ledger columns');
    
    // Migrate existing data (if any transactions exist)
    const [existingTransactions] = await connection.query(
      'SELECT id, amount, discount, grand_total FROM transactions WHERE amount IS NOT NULL'
    );
    
    if (existingTransactions.length > 0) {
      console.log(`📝 Migrating ${existingTransactions.length} existing transactions...`);
      
      for (const transaction of existingTransactions) {
        // Convert old format to new format
        // subtotal = amount (old bill total)
        // paid_amount = 0 (unknown for old bills)
        // current_due = grand_total (what was actually charged)
        await connection.query(
          'UPDATE transactions SET subtotal = ?, paid_amount = 0, current_due = ? WHERE id = ?',
          [transaction.amount || transaction.grand_total, transaction.grand_total, transaction.id]
        );
      }
      
      console.log('✅ Migrated existing transactions');
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('   Your database is now using the Ledger System.\n');
    console.log('📌 Note: Old transactions have been preserved.');
    console.log('   New transactions will use the new ledger format.\n');
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (connection) {
      await connection.end();
    }
    throw error;
  }
}

// Run migration
migrateToLedgerSystem()
  .then(() => {
    console.log('✅ Migration script completed. You can now start the server.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
