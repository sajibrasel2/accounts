# 🎉 New Features Guide - POS Billing System v3.0.0

## ✨ What's New?

আপনার POS Billing System এ তিনটি নতুন শক্তিশালী ফিচার যুক্ত হয়েছে:

1. **15-Day Free Trial System** - বিনামূল্যে ১৫ দিনের ট্রায়াল
2. **Machine ID Tracking** - বারবার ট্রায়াল থেকে সুরক্ষা
3. **Dual Backup System** - দুই জায়গায় ডাটা ব্যাকআপ

---

## 📋 Table of Contents

1. [Free Trial System](#1-free-trial-system)
2. [Machine ID Tracking](#2-machine-id-tracking)
3. [License Upgrade Panel](#3-license-upgrade-panel)
4. [Dual Backup System](#4-dual-backup-system)
5. [Installation & Setup](#5-installation--setup)
6. [Usage Instructions](#6-usage-instructions)
7. [Developer Notes](#7-developer-notes)

---

## 1. Free Trial System

### Overview
- **Duration:** 15 days
- **Features:** Full access to all features
- **Limitations:** Single trial per device (tracked by Machine ID)

### How It Works

```
User First Visit → Auto-detect Machine → No Trial Record → Show "Start Trial" Button
                                                            ↓
                                                       Trial Started
                                                            ↓
                                         15 Days Active → Show Days Remaining
                                                            ↓
                                                    Trial Expires
                                                            ↓
                                            System Locked → Upgrade Required
```

### Database Table: `trial_tracking`

```sql
CREATE TABLE trial_tracking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  machine_id VARCHAR(50) UNIQUE NOT NULL,
  machine_hash VARCHAR(255) NOT NULL,
  trial_started_at DATETIME NOT NULL,
  trial_expires_at DATETIME NOT NULL,
  is_activated BOOLEAN DEFAULT FALSE,
  activation_date DATETIME NULL,
  license_key VARCHAR(100) NULL,
  hostname VARCHAR(255),
  platform VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Trial Status Messages

| Days Remaining | Status | Message |
|---------------|--------|---------|
| 15-4 days | ✅ Active | "Free trial: X days remaining" |
| 3-1 days | ⚠️ Warning | "Trial expiring soon! X days left" |
| 0 days | 🔒 Expired | "Trial expired - Upgrade required" |
| Activated | ✅ Full | "License activated - X days remaining" |

---

## 2. Machine ID Tracking

### Purpose
বারবার free trial শুরু করা থেকে বিরত রাখতে প্রতিটি device এর unique ID তৈরি করা হয়।

### Components Used

Machine ID তৈরিতে ব্যবহৃত hardware identifiers:

1. **MAC Address** (Network Interface)
2. **CPU Model** (Processor Info)
3. **Hostname** (Computer Name)
4. **Platform** (Windows/Linux/Mac)
5. **Architecture** (x64/x86/ARM)

### Machine ID Format

```
MACH-A1B2-C3D4-E5F6-G7H8
```

- **Prefix:** `MACH` (Machine identifier)
- **Hash:** 4 groups of 4 characters (SHA256 hash)
- **Unique:** প্রতিটি device এর জন্য আলাদা

### Storage

Machine ID স্থায়ীভাবে save হয় এই file এ:
```
/.machine_id
```

**⚠️ Important:** এই file delete করলে নতুন Machine ID তৈরি হবে, কিন্তু trial record database এ থাকবে।

---

## 3. License Upgrade Panel

### Location
Dashboard → **Upgrade** Tab (or **🎁 Free Trial** / **🔒 Upgrade** - status অনুযায়ী)

### Features

#### A. System Status Card
```
╔═══════════════════════════════╗
║  🛡️ সিস্টেম স্ট্যাটাস        ║
║  Machine ID: MACH-XXXX-...    ║
║                               ║
║  Status: Trial Active         ║
║  Days Remaining: 12 days      ║
╚═══════════════════════════════╝
```

#### B. Start Free Trial
- বড় green button: "Start Free Trial"
- Features list:
  - ✅ সম্পূর্ণ ফিচার access
  - ✅ WhatsApp automation
  - ✅ Unlimited bills & clients
  - ✅ No credit card required

#### C. Activate License Form
```
Fields:
1. Client Name (আপনার নাম)
2. License Key (SAJIB-XXXX-XXXX-XXXX)
3. Expiry Date (YYYY-MM-DD)

Button: "Activate Now" (Rocket icon)
```

#### D. Contact Support
- **WhatsApp:** 01739354392
- **Facebook:** @sajibrasel2
- **Call:** 01739354392

#### E. Pricing Table
```
1 Month  : ৳500
3 Months : ৳1,200 (সাশ্রয় ৳300)
6 Months : ৳2,000 (সাশ্রয় ৳1,000)
12 Months: ৳3,000 (সাশ্রয় ৳3,000)
```

---

## 4. Dual Backup System

### Overview
ডাটা **দুই জায়গায়** backup হয়:

1. **MySQL Database** (.sql file)
2. **Local JSON Files** (human-readable)
3. **Local CSV Files** (Excel-compatible)

### Backup Location

```
/backups/
├── mysql/
│   ├── mysql_backup_2025-01-09T10-30-45.sql
│   ├── mysql_backup_2025-01-09T11-15-20.sql
│   └── ...
├── json/
│   ├── backup_2025-01-09T10-30-45/
│   │   ├── clients.json
│   │   ├── transactions.json
│   │   ├── bill_items.json
│   │   ├── settings.json
│   │   ├── trial_tracking.json
│   │   └── metadata.json
│   └── ...
└── csv/
    ├── backup_2025-01-09T10-30-45/
    │   ├── clients.csv
    │   ├── transactions.csv
    │   ├── bill_items.csv
    │   ├── settings.csv
    │   ├── trial_tracking.csv
    │   └── README.txt
    └── ...
```

### Backup UI (Settings Tab)

#### A. Backup Actions
```
┌─────────────┬─────────────┬──────────────┐
│ Create      │ View        │ Cleanup Old  │
│ Backup      │ Backups     │              │
└─────────────┴─────────────┴──────────────┘
```

#### B. Backup Summary Cards
```
╔════════════════╗  ╔════════════════╗  ╔════════════════╗
║ MySQL Backups  ║  ║ JSON Backups   ║  ║ CSV Backups    ║
║      5         ║  ║      5         ║  ║      5         ║
╚════════════════╝  ╚════════════════╝  ╚════════════════╝
```

#### C. Backup Tables
Each table shows:
- **Filename/Folder**
- **Size/Files count**
- **Created date**
- **Actions** (Download/Open)

### Backup Methods Comparison

| Method | Format | Use Case | Size | Readability |
|--------|--------|----------|------|-------------|
| **MySQL** | .sql | Complete database restore | Medium | Low |
| **JSON** | .json | Data migration, API import | Small | High |
| **CSV** | .csv | Excel analysis, reports | Small | Medium |

### Auto Backup (Optional)

আপনি চাইলে automatic backup setup করতে পারেন:

#### Windows Task Scheduler:
```batch
# Create daily backup at 2 AM
schtasks /create /tn "POS Backup" /tr "node backup_system.js create" /sc daily /st 02:00
```

#### Linux Cron:
```bash
# Add to crontab
0 2 * * * cd /path/to/pos && node backup_system.js create
```

---

## 5. Installation & Setup

### Prerequisites
```bash
# Required packages (already in package.json)
- express
- mysql2
- whatsapp-web.js
- qrcode
- qrcode-terminal
- dotenv
- cors
```

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Update Database
Database table `trial_tracking` will be created automatically on first run.

### Step 3: Create Backup Directories
Backup directories will be created automatically on first backup.

### Step 4: Start Server
```bash
node server.js
```

### Expected Console Output
```
╔═══════════════════════════════════════════════════╗
║           SYSTEM STATUS - Sajib Digital Hub       ║
╚═══════════════════════════════════════════════════╝

Machine Information:
─────────────────────────────────────────────────
Machine ID:  MACH-A1B2-C3D4-E5F6-G7H8
Hostname:    USER-PC
Platform:    win32

✨ TRIAL AVAILABLE: 15-Day Free Trial
─────────────────────────────────────────────────
Start your free trial from the dashboard!

╚═══════════════════════════════════════════════════╝

🚀 Server is running on http://localhost:3000
```

---

## 6. Usage Instructions

### For Users (Clients)

#### Starting Free Trial
1. Dashboard খুলুন
2. **Upgrade** tab এ যান
3. "Start Free Trial" button এ click করুন
4. Confirm করুন
5. ✅ 15 days trial শুরু!

#### Activating License
1. License key কিনুন (WhatsApp: 01739354392)
2. **Upgrade** tab এ যান
3. License form পূরণ করুন:
   - Client Name
   - License Key
   - Expiry Date
4. "Activate Now" button এ click করুন
5. ✅ System unlock!

#### Creating Backup
1. **Admin Settings** tab এ যান
2. Scroll down to "Backup & Restore System"
3. "Create Backup" button এ click করুন
4. Wait for completion
5. ✅ Backup তৈরি হয়েছে!

#### Viewing Backups
1. **Admin Settings** tab এ যান
2. "View Backups" button এ click করুন
3. সব backup এর list দেখুন
4. Download/Open করুন প্রয়োজন অনুযায়ী

#### Cleaning Up Old Backups
1. **Admin Settings** tab এ যান
2. "Cleanup Old" button এ click করুন
3. কয়টি recent backup রাখবেন বলুন (default: 10)
4. Confirm করুন
5. ✅ পুরাতন backup delete হয়েছে!

---

### For Developers

#### Testing Trial System
```bash
# Check current status
node trial_system.js

# Start trial manually
node trial_system.js start-trial

# List all trials
node trial_system.js list-trials
```

#### Testing Machine ID
```bash
# Generate and show machine ID
node machine_id.js
```

#### Testing Backup System
```bash
# Create complete backup
node backup_system.js create

# List all backups
node backup_system.js list

# Cleanup (keep last 10)
node backup_system.js cleanup 10
```

#### API Endpoints

##### Trial & License
```javascript
// Get system status
GET /api/system/status

// Start free trial
POST /api/trial/start

// Activate license
POST /api/license/activate
Body: { licenseKey, clientName, expiryDate }
```

##### Backup
```javascript
// Create backup
POST /api/backup/create

// List backups
GET /api/backup/list

// Download backup
GET /api/backup/download/:type/:filename

// Cleanup old backups
POST /api/backup/cleanup
Body: { keepCount }
```

---

## 7. Developer Notes

### File Structure

```
/
├── machine_id.js           # Machine fingerprinting
├── trial_system.js         # Trial logic & database
├── backup_system.js        # Dual backup implementation
├── server.js               # Updated with new endpoints
├── .machine_id             # Stored machine ID (auto-generated)
├── .env                    # License configuration
├── backups/                # Backup storage (auto-created)
│   ├── mysql/
│   ├── json/
│   └── csv/
├── public/
│   ├── index.html          # Updated with Upgrade tab & Backup UI
│   └── app.js              # Updated with new functions
└── NEW_FEATURES_GUIDE.md   # This file
```

### Security Considerations

1. **Machine ID Storage:**
   - `.machine_id` file should be in `.gitignore`
   - Contains hardware fingerprint (safe to store locally)

2. **Trial Tracking:**
   - Database stores machine_id and machine_hash
   - Prevents repeated trials via hardware fingerprint matching
   - Even if `.machine_id` file is deleted, trial cannot be restarted

3. **Backup Files:**
   - Contain sensitive data (clients, transactions)
   - `/backups` folder should be in `.gitignore`
   - Recommend: Copy to external drive/cloud storage regularly
   - **Never commit backups to Git!**

4. **License Activation:**
   - License validation happens on server
   - Activation stored in database (not just .env)
   - Machine ID linked to license for tracking

### Troubleshooting

#### Trial System Issues

**Problem:** Trial shows "Already used" but I haven't used it
- **Cause:** Machine ID exists in database
- **Solution:** Check database `trial_tracking` table for your machine_id

**Problem:** Trial expired, want to extend for testing
- **Solution (Dev only):**
```sql
-- Update trial expiry
UPDATE trial_tracking 
SET trial_expires_at = DATE_ADD(NOW(), INTERVAL 15 DAY) 
WHERE machine_id = 'MACH-XXXX-...';
```

#### Backup System Issues

**Problem:** MySQL backup fails
- **Cause:** `mysqldump` not found
- **Solution:** Ensure MySQL is installed and `mysqldump` is in PATH
- **Windows:** Add `C:\xampp\mysql\bin` to PATH

**Problem:** Backup folder not created
- **Cause:** Permission issues
- **Solution:** Run as administrator or check folder permissions

#### Machine ID Issues

**Problem:** Different Machine ID every time
- **Cause:** `.machine_id` file is being deleted
- **Solution:** Don't delete `.machine_id` file, add to `.gitignore`

**Problem:** Machine ID doesn't match after hardware change
- **Expected:** Machine ID changes if MAC address/CPU changes
- **Solution:** Contact support for license transfer

---

## 🎯 Summary

### What You Get

✅ **Free Trial System**
- 15 days full access
- One-time per device
- Auto-expires, no manual intervention needed

✅ **Machine ID Tracking**
- Prevents abuse
- Hardware fingerprinting
- Secure & reliable

✅ **License Upgrade**
- User-friendly upgrade panel
- Instant activation
- Clear pricing & contact info

✅ **Dual Backup**
- MySQL (complete restore)
- JSON (human-readable)
- CSV (Excel-compatible)
- Auto-timestamped backups
- Easy cleanup

### Next Steps

1. ✅ Test trial system
2. ✅ Create test backups
3. ✅ Test license activation flow
4. 📤 Deploy to production
5. 📢 Inform clients about new features

---

## 📞 Support

**Developer:** Sajib Digital Hub

**Contact:**
- 📱 WhatsApp: 01739354392
- 💬 Facebook: @sajibrasel2
- 📧 Email: raselsajib25@gmail.com

**Documentation:**
- Trial System: `trial_system.js`
- Machine ID: `machine_id.js`
- Backup System: `backup_system.js`
- This Guide: `NEW_FEATURES_GUIDE.md`

---

**Version:** 3.0.0  
**Release Date:** January 9, 2025  
**Author:** Sajib Digital Hub  

© 2024-2026 | Made with ❤️ in Bangladesh 🇧🇩
