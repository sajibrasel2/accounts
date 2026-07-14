# 🚀 SSH Setup Commands - Complete Guide

**Server:** grreseller1  
**User:** techandc  
**Directory:** ~/public_html/accounts

---

## ✅ Step 1: Activate NVM (You already installed it!)

You successfully installed nvm! Now activate it:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

Or just close and reopen your SSH session.

---

## ✅ Step 2: Install Node.js

```bash
# Install Node.js LTS version
nvm install --lts

# Verify installation
node --version
npm --version
```

**Expected output:**
```
v20.x.x
10.x.x
```

---

## ✅ Step 3: Install Project Dependencies

```bash
# Navigate to project
cd ~/public_html/accounts

# Install dependencies
npm install
```

**This will install:**
- express
- mysql2
- whatsapp-web.js
- qrcode
- dotenv
- cors
- multer
- And all other dependencies

---

## ✅ Step 4: Fix Database Tables

**Option A: Run SQL commands directly in SSH:**

```bash
mysql -u techandc_bot -p techandc_accounts
```

**Enter password:** `12345Sajibs6@`

**Then run these SQL commands:**

```sql
-- Drop all tables (if they exist with errors)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS bill_items;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS trial_tracking;
SET FOREIGN_KEY_CHECKS = 1;

-- Create clients table
CREATE TABLE clients (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  phone varchar(20) NOT NULL,
  balance decimal(10,2) DEFAULT 0.00,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY phone (phone),
  KEY idx_phone (phone),
  KEY idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create transactions table
CREATE TABLE transactions (
  id int(11) NOT NULL AUTO_INCREMENT,
  client_id int(11) NOT NULL,
  type enum('INCOME','EXPENSE','DUE') NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  paid_amount decimal(10,2) DEFAULT 0.00,
  current_due decimal(10,2) DEFAULT 0.00,
  previous_due decimal(10,2) DEFAULT 0.00,
  total_due decimal(10,2) DEFAULT 0.00,
  description text,
  whatsapp_status enum('SENT','FAILED','PENDING') DEFAULT 'PENDING',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_client_id (client_id),
  KEY idx_type (type),
  KEY idx_created_at (created_at),
  CONSTRAINT transactions_ibfk_1 FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create bill_items table
CREATE TABLE bill_items (
  id int(11) NOT NULL AUTO_INCREMENT,
  transaction_id int(11) NOT NULL,
  item_name varchar(255) NOT NULL,
  quantity int(11) NOT NULL DEFAULT 1,
  rate decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_transaction_id (transaction_id),
  CONSTRAINT bill_items_ibfk_1 FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create settings table
CREATE TABLE settings (
  id int(11) NOT NULL AUTO_INCREMENT,
  business_name varchar(255) DEFAULT 'Sajib Digital hub',
  business_phone varchar(20) DEFAULT '',
  business_address text,
  header_text text,
  footer_text text,
  logo_path varchar(255) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default settings
INSERT INTO settings (business_name, business_phone, business_address, header_text, footer_text) 
VALUES ('Sajib Digital hub', '', '', 'ধন্যবাদ আমাদের সেবা নেওয়ার জন্য', 'আবার আসবেন 🙏');

-- Create trial_tracking table
CREATE TABLE trial_tracking (
  id int(11) NOT NULL AUTO_INCREMENT,
  machine_id varchar(255) NOT NULL,
  machine_hash varchar(255) NOT NULL,
  trial_started_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trial_expires_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_activated tinyint(1) DEFAULT 0,
  license_key varchar(255) DEFAULT NULL,
  activated_at timestamp NULL DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY machine_id (machine_id),
  KEY idx_machine_id (machine_id),
  KEY idx_machine_hash (machine_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exit MySQL
EXIT;
```

**Option B: Import updated SQL file from phpMyAdmin:**

1. Go to phpMyAdmin
2. Select `techandc_accounts` database
3. Click "Import"
4. Upload `schema_production.sql` (updated version from GitHub)
5. Click "Go"

---

## ✅ Step 5: Start the Application

```bash
# Navigate to project
cd ~/public_html/accounts

# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start server.js --name billing-system

# Save PM2 process list
pm2 save

# Set PM2 to start on reboot
pm2 startup
# Follow the command shown

# Check status
pm2 status

# View logs
pm2 logs billing-system
```

---

## ✅ Step 6: Access Your Application

**URL:** `http://techandcode.com:3000`  
or  
**URL:** `http://your-server-ip:3000`

---

## 📋 Complete SSH Session (Copy & Paste)

```bash
# 1. Activate NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 2. Install Node.js
nvm install --lts

# 3. Verify
node --version
npm --version

# 4. Navigate to project
cd ~/public_html/accounts

# 5. Install dependencies
npm install

# 6. Install PM2
npm install -g pm2

# 7. Start application
pm2 start server.js --name billing-system

# 8. Save PM2
pm2 save

# 9. Setup auto-start
pm2 startup

# 10. Check status
pm2 status

# 11. View logs
pm2 logs billing-system --lines 50
```

---

## 🔍 Verification Commands

```bash
# Check if Node.js is installed
node --version

# Check if npm is installed
npm --version

# Check if project dependencies are installed
ls -la node_modules/

# Check if server is running
pm2 status

# Check application logs
pm2 logs billing-system

# Check if port 3000 is open
netstat -tulpn | grep 3000

# Test database connection
mysql -u techandc_bot -p techandc_accounts
```

---

## 🆘 Troubleshooting

### Issue: "nvm: command not found" after closing SSH

**Solution:**
```bash
# Add to .bashrc permanently
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
source ~/.bashrc
```

### Issue: "npm install" fails with permission errors

**Solution:**
```bash
# Make sure you own the directory
sudo chown -R $USER:$USER ~/public_html/accounts
chmod -R 755 ~/public_html/accounts
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in .env
echo "PORT=3001" >> .env
```

### Issue: Database connection fails

**Solution:**
```bash
# Test database credentials
mysql -u techandc_bot -p techandc_accounts

# If it works, check .env file
cat .env | grep DB_

# Make sure credentials match
```

### Issue: WhatsApp not connecting

**Solution:**
```bash
# Create required directories
mkdir -p .wwebjs_auth
mkdir -p .wwebjs_cache
chmod 755 .wwebjs_auth
chmod 755 .wwebjs_cache
```

---

## 🎯 Expected Final Output

After running all commands, you should see:

```
✓ Node.js v20.x.x installed
✓ npm 10.x.x installed
✓ Dependencies installed (45 packages)
✓ PM2 process running
✓ Application accessible at http://your-domain.com:3000
```

**PM2 Status:**
```
┌─────┬─────────────────┬─────────┬──────┬───────────┬──────────┐
│ id  │ name            │ status  │ cpu  │ memory    │ restart  │
├─────┼─────────────────┼─────────┼──────┼───────────┼──────────┤
│ 0   │ billing-system  │ online  │ 0%   │ 50.0mb    │ 0        │
└─────┴─────────────────┴─────────┴──────┴───────────┴──────────┘
```

---

## 📱 Next Steps After Setup

1. ✅ Access application in browser
2. ✅ Go to Admin Settings → Scan WhatsApp QR code
3. ✅ Update business information
4. ✅ Add first client
5. ✅ Create test bill
6. ✅ Celebrate! 🎉

---

## 🔗 Useful Commands

```bash
# PM2 Management
pm2 list                    # List all processes
pm2 restart billing-system  # Restart app
pm2 stop billing-system     # Stop app
pm2 delete billing-system   # Remove from PM2
pm2 logs billing-system     # View logs
pm2 monit                   # Monitor in real-time

# Git Commands (for updates)
git pull origin main        # Pull latest code
npm install                 # Update dependencies
pm2 restart billing-system  # Restart app

# Database Backup
mysqldump -u techandc_bot -p techandc_accounts > backup.sql

# Check Server Resources
free -h                     # Check memory
df -h                       # Check disk space
top                         # Check CPU usage
```

---

**🎉 Your server is ready! Follow these commands step by step and you'll be live in 5 minutes! 💼✨**
