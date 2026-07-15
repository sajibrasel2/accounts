# ⚡ Quick Database Fix - Your App is Running!

**Status:** ✅ Application is ONLINE and running on PM2!

**Issue:** Database tables need to be created (schema_production.sql file not found)

---

## 🚀 Fix Database NOW (2 Easy Options)

### **Option 1: Use phpMyAdmin** ⭐ Easiest (2 minutes)

1. **Go to phpMyAdmin** (from your cPanel)

2. **Select database:** `techandc_accounts`

3. **Click "SQL" tab**

4. **Copy and paste this complete SQL:**

```sql
-- Drop existing tables (if any)
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
```

5. **Click "Go"**

6. **Verify tables created:**
   - You should see: clients, transactions, bill_items, settings, trial_tracking

7. ✅ **Done! Now access your app!**

---

### **Option 2: SSH Command Line** (Alternative)

```bash
# Download the SQL file from GitHub
cd ~/public_html/accounts
wget https://raw.githubusercontent.com/sajibrasel2/accounts/main/schema_production.sql

# Import to database
mysql -u techandc_bot -p techandc_accounts < schema_production.sql
# Password: 12345Sajibs6@
```

---

## 🌐 Access Your Application

**Your app is running on PM2!** 

**URL:** `http://techandcode.com:3000`  
**or**  
**URL:** `http://your-server-ip:3000`

---

## 📊 Check PM2 Status

```bash
# View status
pm2 status

# View logs
pm2 logs billing-pos

# View last 50 lines
pm2 logs billing-pos --lines 50

# Monitor in real-time
pm2 monit
```

---

## ✅ Verification Steps

After creating tables in phpMyAdmin:

1. **Check tables exist:**
   - Go to phpMyAdmin → techandc_accounts
   - Should see 5 tables: clients, transactions, bill_items, settings, trial_tracking

2. **Check app logs:**
   ```bash
   pm2 logs billing-pos --lines 20
   ```
   
   Should see:
   ```
   ✅ Database & Tables auto-configured successfully
   🚀 Server running on port 3000
   ```

3. **Access application:**
   - Open browser
   - Go to: `http://techandcode.com:3000`
   - Should see POS Billing System dashboard

---

## 🎯 Current Status

```
✅ Node.js v20.20.2 - INSTALLED
✅ npm v10.8.2 - INSTALLED
✅ Dependencies (354 packages) - INSTALLED
✅ PM2 - INSTALLED & RUNNING
✅ Application "billing-pos" - ONLINE (52.1mb memory)
⏳ Database tables - NEED TO CREATE (use Option 1 above)
```

---

## 🔧 PM2 Management Commands

```bash
# Restart application
pm2 restart billing-pos

# Stop application
pm2 stop billing-pos

# Start application
pm2 start billing-pos

# Delete from PM2
pm2 delete billing-pos

# View logs
pm2 logs billing-pos

# Clear logs
pm2 flush

# Monitor
pm2 monit

# Save process list
pm2 save

# Setup auto-start on reboot
pm2 startup
```

---

## 🆘 If Application Shows Errors

**Check logs:**
```bash
pm2 logs billing-pos --err
```

**Common issues:**

1. **Database connection error:**
   - Check .env file has correct credentials
   - Make sure database tables are created (use Option 1 above)

2. **Port already in use:**
   - Change PORT in .env file
   - Restart: `pm2 restart billing-pos`

3. **Permission errors:**
   - Fix permissions: `chmod -R 755 ~/public_html/accounts`

---

## 🎊 Next Steps

1. ✅ **Create database tables** (Use Option 1 - phpMyAdmin)
2. ✅ **Access application** in browser
3. ✅ **Go to Admin Settings** → Scan WhatsApp QR code
4. ✅ **Update business information**
5. ✅ **Add your first client**
6. ✅ **Create your first bill**
7. ✅ **Celebrate!** 🎉

---

## 📱 Admin Panel Access

Once tables are created:

**URL:** `http://techandcode.com:3000/admin_panel.html`

**Credentials:**
- Email: `raselsajib25@gmail.com`
- Password: `12345Sajibs6@`

---

**🎉 Your app is 95% ready! Just create the database tables using Option 1 and you're LIVE! 💼✨**
