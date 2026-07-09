// Dual Backup System - MySQL + Local JSON/CSV
// Automatically backs up database to 2 locations
// Developer: Sajib Digital Hub

const fs = require('fs');
const path = require('path');
const { getPool } = require('./db');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Backup directories
const BACKUP_DIR = path.join(__dirname, 'backups');
const MYSQL_BACKUP_DIR = path.join(BACKUP_DIR, 'mysql');
const JSON_BACKUP_DIR = path.join(BACKUP_DIR, 'json');
const CSV_BACKUP_DIR = path.join(BACKUP_DIR, 'csv');

/**
 * Initialize backup directories
 */
function initializeBackupDirectories() {
  const dirs = [BACKUP_DIR, MYSQL_BACKUP_DIR, JSON_BACKUP_DIR, CSV_BACKUP_DIR];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created backup directory: ${dir}`);
    }
  });
}

/**
 * Generate timestamped filename
 */
function getTimestampedFilename(prefix, extension) {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').split('.')[0]; // 2025-01-09T10-30-45
  return `${prefix}_${timestamp}.${extension}`;
}

/**
 * Backup MySQL Database (using mysqldump)
 * Creates .sql file with complete database dump
 */
async function backupMySQLDatabase() {
  try {
    initializeBackupDirectories();
    
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'local_billing_db'
    };
    
    const filename = getTimestampedFilename('mysql_backup', 'sql');
    const filepath = path.join(MYSQL_BACKUP_DIR, filename);
    
    // Build mysqldump command
    const passwordArg = dbConfig.password ? `-p"${dbConfig.password}"` : '';
    const command = `mysqldump -h ${dbConfig.host} -u ${dbConfig.user} ${passwordArg} ${dbConfig.database} > "${filepath}"`;
    
    // Execute mysqldump
    await execAsync(command);
    
    // Verify file was created
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      return {
        success: true,
        message: 'MySQL database backup created successfully',
        filepath: filepath,
        filename: filename,
        filesize: `${fileSizeMB} MB`,
        timestamp: new Date().toISOString()
      };
    } else {
      throw new Error('Backup file was not created');
    }
    
  } catch (error) {
    console.error('MySQL backup error:', error);
    return {
      success: false,
      message: 'Failed to create MySQL backup',
      error: error.message
    };
  }
}

/**
 * Backup to JSON files (separate file for each table)
 * More human-readable and portable
 */
async function backupToJSON() {
  try {
    initializeBackupDirectories();
    
    const pool = getPool();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0];
    const backupFolder = path.join(JSON_BACKUP_DIR, `backup_${timestamp}`);
    
    // Create timestamped folder
    if (!fs.existsSync(backupFolder)) {
      fs.mkdirSync(backupFolder, { recursive: true });
    }
    
    const tables = ['clients', 'transactions', 'bill_items', 'settings', 'trial_tracking'];
    const backupResults = {};
    
    for (const table of tables) {
      try {
        const [rows] = await pool.query(`SELECT * FROM ${table}`);
        const filename = `${table}.json`;
        const filepath = path.join(backupFolder, filename);
        
        fs.writeFileSync(filepath, JSON.stringify(rows, null, 2));
        
        backupResults[table] = {
          success: true,
          records: rows.length,
          file: filename
        };
      } catch (error) {
        backupResults[table] = {
          success: false,
          error: error.message
        };
      }
    }
    
    // Create metadata file
    const metadata = {
      backupDate: new Date().toISOString(),
      backupType: 'JSON',
      tables: backupResults,
      database: process.env.DB_NAME || 'local_billing_db'
    };
    
    fs.writeFileSync(
      path.join(backupFolder, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
    
    return {
      success: true,
      message: 'JSON backup created successfully',
      folder: backupFolder,
      tables: backupResults,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('JSON backup error:', error);
    return {
      success: false,
      message: 'Failed to create JSON backup',
      error: error.message
    };
  }
}

/**
 * Backup to CSV files (Excel-compatible)
 * Best for importing into spreadsheet software
 */
async function backupToCSV() {
  try {
    initializeBackupDirectories();
    
    const pool = getPool();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0];
    const backupFolder = path.join(CSV_BACKUP_DIR, `backup_${timestamp}`);
    
    // Create timestamped folder
    if (!fs.existsSync(backupFolder)) {
      fs.mkdirSync(backupFolder, { recursive: true });
    }
    
    const tables = ['clients', 'transactions', 'bill_items', 'settings', 'trial_tracking'];
    const backupResults = {};
    
    for (const table of tables) {
      try {
        const [rows] = await pool.query(`SELECT * FROM ${table}`);
        
        if (rows.length === 0) {
          backupResults[table] = {
            success: true,
            records: 0,
            message: 'Table is empty'
          };
          continue;
        }
        
        // Get column names
        const columns = Object.keys(rows[0]);
        
        // Create CSV content
        let csvContent = columns.join(',') + '\n';
        
        rows.forEach(row => {
          const values = columns.map(col => {
            let value = row[col];
            
            // Handle null/undefined
            if (value === null || value === undefined) {
              return '';
            }
            
            // Handle dates
            if (value instanceof Date) {
              value = value.toISOString();
            }
            
            // Escape quotes and wrap in quotes if contains comma
            value = String(value).replace(/"/g, '""');
            if (value.includes(',') || value.includes('\n') || value.includes('"')) {
              value = `"${value}"`;
            }
            
            return value;
          });
          
          csvContent += values.join(',') + '\n';
        });
        
        const filename = `${table}.csv`;
        const filepath = path.join(backupFolder, filename);
        
        fs.writeFileSync(filepath, csvContent, 'utf8');
        
        backupResults[table] = {
          success: true,
          records: rows.length,
          file: filename
        };
      } catch (error) {
        backupResults[table] = {
          success: false,
          error: error.message
        };
      }
    }
    
    // Create README file
    const readme = `CSV Backup - ${new Date().toISOString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Database: ${process.env.DB_NAME || 'local_billing_db'}
Backup Date: ${new Date().toLocaleString('bn-BD')}

Files:
${Object.keys(backupResults).map(table => `- ${table}.csv (${backupResults[table].records || 0} records)`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Import Instructions:
1. Open Excel or Google Sheets
2. Import CSV file
3. Select comma as delimiter
4. Verify data imported correctly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sajib Digital Hub | 01739354392
`;
    
    fs.writeFileSync(path.join(backupFolder, 'README.txt'), readme);
    
    return {
      success: true,
      message: 'CSV backup created successfully',
      folder: backupFolder,
      tables: backupResults,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('CSV backup error:', error);
    return {
      success: false,
      message: 'Failed to create CSV backup',
      error: error.message
    };
  }
}

/**
 * Create complete backup (MySQL + JSON + CSV)
 * This is the main backup function
 */
async function createCompleteBackup() {
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║         DUAL BACKUP SYSTEM - Starting            ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    backups: {}
  };
  
  // 1. MySQL Backup
  console.log('📦 Creating MySQL backup...');
  const mysqlResult = await backupMySQLDatabase();
  results.backups.mysql = mysqlResult;
  
  if (mysqlResult.success) {
    console.log(`✅ MySQL backup: ${mysqlResult.filename} (${mysqlResult.filesize})`);
  } else {
    console.log(`❌ MySQL backup failed: ${mysqlResult.error}`);
  }
  
  // 2. JSON Backup
  console.log('\n📦 Creating JSON backup...');
  const jsonResult = await backupToJSON();
  results.backups.json = jsonResult;
  
  if (jsonResult.success) {
    console.log(`✅ JSON backup: ${path.basename(jsonResult.folder)}`);
    Object.entries(jsonResult.tables).forEach(([table, result]) => {
      if (result.success) {
        console.log(`   - ${table}: ${result.records} records`);
      }
    });
  } else {
    console.log(`❌ JSON backup failed: ${jsonResult.error}`);
  }
  
  // 3. CSV Backup
  console.log('\n📦 Creating CSV backup...');
  const csvResult = await backupToCSV();
  results.backups.csv = csvResult;
  
  if (csvResult.success) {
    console.log(`✅ CSV backup: ${path.basename(csvResult.folder)}`);
    Object.entries(csvResult.tables).forEach(([table, result]) => {
      if (result.success) {
        console.log(`   - ${table}: ${result.records} records`);
      }
    });
  } else {
    console.log(`❌ CSV backup failed: ${csvResult.error}`);
  }
  
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║         DUAL BACKUP SYSTEM - Completed           ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');
  
  // Determine overall success
  const overallSuccess = mysqlResult.success || jsonResult.success || csvResult.success;
  
  return {
    success: overallSuccess,
    message: overallSuccess ? 'Backup completed successfully' : 'All backup methods failed',
    ...results
  };
}

/**
 * Get list of all available backups
 */
function listBackups() {
  initializeBackupDirectories();
  
  const backups = {
    mysql: [],
    json: [],
    csv: []
  };
  
  // List MySQL backups
  if (fs.existsSync(MYSQL_BACKUP_DIR)) {
    const files = fs.readdirSync(MYSQL_BACKUP_DIR);
    backups.mysql = files
      .filter(f => f.endsWith('.sql'))
      .map(f => {
        const filepath = path.join(MYSQL_BACKUP_DIR, f);
        const stats = fs.statSync(filepath);
        return {
          filename: f,
          filepath: filepath,
          size: `${(stats.size / (1024 * 1024)).toFixed(2)} MB`,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
      .sort((a, b) => b.created - a.created);
  }
  
  // List JSON backups
  if (fs.existsSync(JSON_BACKUP_DIR)) {
    const folders = fs.readdirSync(JSON_BACKUP_DIR);
    backups.json = folders
      .filter(f => fs.statSync(path.join(JSON_BACKUP_DIR, f)).isDirectory())
      .map(f => {
        const folderPath = path.join(JSON_BACKUP_DIR, f);
        const stats = fs.statSync(folderPath);
        const files = fs.readdirSync(folderPath);
        
        return {
          folder: f,
          filepath: folderPath,
          files: files.length,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
      .sort((a, b) => b.created - a.created);
  }
  
  // List CSV backups
  if (fs.existsSync(CSV_BACKUP_DIR)) {
    const folders = fs.readdirSync(CSV_BACKUP_DIR);
    backups.csv = folders
      .filter(f => fs.statSync(path.join(CSV_BACKUP_DIR, f)).isDirectory())
      .map(f => {
        const folderPath = path.join(CSV_BACKUP_DIR, f);
        const stats = fs.statSync(folderPath);
        const files = fs.readdirSync(folderPath);
        
        return {
          folder: f,
          filepath: folderPath,
          files: files.length,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
      .sort((a, b) => b.created - a.created);
  }
  
  return backups;
}

/**
 * Delete old backups (keep only last N backups)
 */
function cleanupOldBackups(keepCount = 10) {
  const backups = listBackups();
  let deletedCount = 0;
  
  // Cleanup MySQL backups
  if (backups.mysql.length > keepCount) {
    const toDelete = backups.mysql.slice(keepCount);
    toDelete.forEach(backup => {
      fs.unlinkSync(backup.filepath);
      deletedCount++;
    });
  }
  
  // Cleanup JSON backups
  if (backups.json.length > keepCount) {
    const toDelete = backups.json.slice(keepCount);
    toDelete.forEach(backup => {
      fs.rmSync(backup.filepath, { recursive: true, force: true });
      deletedCount++;
    });
  }
  
  // Cleanup CSV backups
  if (backups.csv.length > keepCount) {
    const toDelete = backups.csv.slice(keepCount);
    toDelete.forEach(backup => {
      fs.rmSync(backup.filepath, { recursive: true, force: true });
      deletedCount++;
    });
  }
  
  return {
    success: true,
    message: `Cleaned up ${deletedCount} old backups`,
    deletedCount: deletedCount,
    keepCount: keepCount
  };
}

// CLI usage
if (require.main === module) {
  (async () => {
    const command = process.argv[2];
    
    if (command === 'create' || !command) {
      // Create complete backup
      const { autoConfigureDatabase } = require('./db');
      await autoConfigureDatabase();
      
      const result = await createCompleteBackup();
      
      if (result.success) {
        console.log('\n✅ Backup completed successfully!');
        console.log(`📁 Backups saved in: ${BACKUP_DIR}`);
      } else {
        console.log('\n❌ Backup failed!');
      }
      
    } else if (command === 'list') {
      // List all backups
      const backups = listBackups();
      
      console.log('\n╔═══════════════════════════════════════════════════╗');
      console.log('║           AVAILABLE BACKUPS                       ║');
      console.log('╚═══════════════════════════════════════════════════╝\n');
      
      console.log('MySQL Backups:');
      if (backups.mysql.length === 0) {
        console.log('  No backups found');
      } else {
        backups.mysql.forEach((b, i) => {
          console.log(`  ${i + 1}. ${b.filename} (${b.size}) - ${new Date(b.created).toLocaleString('bn-BD')}`);
        });
      }
      
      console.log('\nJSON Backups:');
      if (backups.json.length === 0) {
        console.log('  No backups found');
      } else {
        backups.json.forEach((b, i) => {
          console.log(`  ${i + 1}. ${b.folder} (${b.files} files) - ${new Date(b.created).toLocaleString('bn-BD')}`);
        });
      }
      
      console.log('\nCSV Backups:');
      if (backups.csv.length === 0) {
        console.log('  No backups found');
      } else {
        backups.csv.forEach((b, i) => {
          console.log(`  ${i + 1}. ${b.folder} (${b.files} files) - ${new Date(b.created).toLocaleString('bn-BD')}`);
        });
      }
      
      console.log('\n');
      
    } else if (command === 'cleanup') {
      // Cleanup old backups
      const keepCount = parseInt(process.argv[3]) || 10;
      const result = cleanupOldBackups(keepCount);
      console.log(`\n${result.message}`);
      
    } else {
      console.log('\nUsage:');
      console.log('  node backup_system.js create   - Create complete backup');
      console.log('  node backup_system.js list     - List all backups');
      console.log('  node backup_system.js cleanup [count] - Keep only last N backups (default: 10)');
      console.log('\n');
    }
    
    process.exit(0);
  })();
}

module.exports = {
  initializeBackupDirectories,
  backupMySQLDatabase,
  backupToJSON,
  backupToCSV,
  createCompleteBackup,
  listBackups,
  cleanupOldBackups
};
