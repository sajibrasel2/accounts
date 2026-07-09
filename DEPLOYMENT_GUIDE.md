# 🚀 Production Deployment Guide

Complete guide for deploying the POS Billing System to a production server (cPanel/VPS/Shared Hosting).

---

## 📋 Pre-Deployment Checklist

Before deploying to production, ensure you have:

- ✅ cPanel/server access credentials
- ✅ SSH access (recommended) or FTP access
- ✅ MySQL database access in cPanel
- ✅ Node.js support on your hosting (most cPanel hosts support it)
- ✅ Domain or subdomain ready (optional)

---

## 🗄️ Step 1: Prepare Database on Server

### 1.1 Create MySQL Database

1. **Login to cPanel**
2. **Go to MySQL Databases**
3. **Create New Database:**
   - Database Name: `techandc_accounts`
   - Click "Create Database"

### 1.2 Create Database User

1. **In MySQL Databases section:**
2. **Create New User:**
   - Username: `techandc_bot`
   - Password: `12345Sajibs6@`
   - Password Strength: Strong (100/100)
   - Click "Create User"

### 1.3 Add User to Database

1. **In "Add User to Database" section:**
   - Select User: `techandc_bot`
   - Select Database: `techandc_accounts`
   - Click "Add"

2. **Set Privileges:**
   - Check "ALL PRIVILEGES"
   - Click "Make Changes"

### 1.4 Note Your Database Details

```
DB_HOST=localhost
DB_USER=techandc_bot (or with prefix: yourprefix_techandc_bot)
DB_PASSWORD=12345Sajibs6@
DB_NAME=techandc_accounts (or with prefix: yourprefix_techandc_accounts)
```

**⚠️ Important:** Many cPanel hosts add a prefix to usernames and database names. Check your cPanel for the exact names!

---

## 📤 Step 2: Upload Files to Server

### Option A: Using Git (Recommended)

```bash
# SSH into your server
ssh username@your-server.com

# Navigate to your web directory
cd ~/public_html/billing

# Clone the repository
git clone https://github.com/sajibrasel2/accounts.git .

# Or if already cloned, pull latest changes
git pull origin main
```

### Option B: Using FTP/File Manager

1. **Download the project as ZIP** from GitHub
2. **Upload to server** using:
   - cPanel File Manager (recommended)
   - FTP client (FileZilla, WinSCP)
3. **Extract files** to desired directory:
   - `public_html/billing/` (for subdirectory access)
   - `public_html/` (for root access)

---

## ⚙️ Step 3: Configure Environment

### 3.1 Copy Environment File

```bash
# SSH method
cp .env.production .env

# Or manually in cPanel File Manager
# Right-click .env.production → Copy → Rename to .env
```

### 3.2 Update `.env` with Production Credentials

Open `.env` file and update database credentials:

```env
# ═══════════════════════════════════════════════════════════
# PRODUCTION DATABASE CONFIGURATION
# ═══════════════════════════════════════════════════════════

DB_HOST=localhost
DB_USER=techandc_bot          # Use your actual username (may have prefix)
DB_PASSWORD=12345Sajibs6@      # Your database password
DB_NAME=techandc_accounts      # Your database name (may have prefix)

# Server Configuration
PORT=3000                      # Or any available port
NODE_ENV=production

# License Configuration (Will be updated by clients)
LICENSE_CLIENT_NAME=Demo User
LICENSE_KEY=DEMO-KEY-EXPIRES-SOON
LICENSE_EXPIRY=2025-01-31
```

**⚠️ Common Mistake:** If your cPanel uses prefixes, your actual credentials might be:
```env
DB_USER=yoursite_techandc_bot
DB_NAME=yoursite_techandc_accounts
```

### 3.3 Verify Environment File

```bash
# Check if .env exists and has correct permissions
ls -la .env
chmod 600 .env    # Make it readable only by owner
```

---

## 📦 Step 4: Install Dependencies

### 4.1 Install Node.js Packages

```bash
# SSH into server
cd ~/public_html/billing

# Install dependencies
npm install

# If you get permission errors, use:
npm install --production
```

### 4.2 Verify Installation

```bash
# Check if node_modules folder was created
ls -la node_modules

# Check package.json
cat package.json
```

---

## 🗃️ Step 5: Initialize Database

### 5.1 Run Migration Script

```bash
# Run the database migration
node migrate_to_ledger.js
```

**Expected Output:**
```
✅ Database 'techandc_accounts' exists.
✅ Table 'clients' exists.
✅ Table 'transactions' exists.
...
✅ Migration completed successfully!
```

### 5.2 Verify Database Tables

1. Go to **cPanel → phpMyAdmin**
2. Select database `techandc_accounts`
3. Verify these tables exist:
   - `clients`
   - `transactions`
   - `bill_items`
   - `settings`
   - `trial_tracking`

---

## 🚀 Step 6: Start the Application

### Option A: Using PM2 (Recommended for Production)

```bash
# Install PM2 globally (if not installed)
npm install -g pm2

# Start the application
pm2 start server.js --name "billing-system"

# Save PM2 process list
pm2 save

# Set PM2 to start on server reboot
pm2 startup
# Follow the instructions shown

# Verify application is running
pm2 status
pm2 logs billing-system
```

### Option B: Using Node.js App Manager (cPanel)

1. **Go to cPanel → Setup Node.js App**
2. **Create New Application:**
   - Node.js Version: 14.x or higher
   - Application Mode: Production
   - Application Root: `/home/username/public_html/billing`
   - Application URL: `billing` (or your subdomain)
   - Application Startup File: `server.js`
   - Click "Create"

3. **Set Environment Variables** (in the app settings):
   - Add all variables from `.env` file

4. **Start the Application**
   - Click "Start App" button

### Option C: Manual Start (Testing Only)

```bash
# Start server manually
node server.js

# Or with npm
npm start
```

**⚠️ Warning:** Manual start stops when you close SSH. Use PM2 or cPanel Node.js App Manager for persistent running.

---

## 🌐 Step 7: Access Your Application

### 7.1 Direct Port Access

If your server allows port access:
```
http://your-domain.com:3000
http://your-ip-address:3000
```

### 7.2 Setup Reverse Proxy (Recommended)

**Method 1: Using .htaccess**

Create or edit `.htaccess` in your web root:

```apache
RewriteEngine On
RewriteRule ^billing$ http://127.0.0.1:3000/ [P,L]
RewriteRule ^billing/(.*)$ http://127.0.0.1:3000/$1 [P,L]
```

Access: `http://your-domain.com/billing`

**Method 2: Using Subdomain**

1. **Create subdomain in cPanel:** `billing.your-domain.com`
2. **Point to proxy:** Configure Apache/Nginx to proxy to localhost:3000
3. Access: `http://billing.your-domain.com`

**Method 3: Using cPanel Node.js App Manager**

If using cPanel's Node.js App Manager, it automatically sets up the proxy.
Access: `http://your-domain.com/billing` (or your configured URL)

---

## 📱 Step 8: Configure WhatsApp

### 8.1 Connect WhatsApp

1. **Open your production URL**
2. **Go to Admin Settings tab**
3. **Scroll to WhatsApp Connection section**
4. **Scan QR code** with your business WhatsApp:
   - Open WhatsApp on your phone
   - Go to Settings → Linked Devices
   - Tap "Link a Device"
   - Scan the QR code shown on screen

### 8.2 Verify Connection

- Status should show: "✅ Connected"
- Try sending a test bill to verify

**⚠️ Important:** WhatsApp session will persist even after server restart.

---

## 🔧 Step 9: Configure Business Settings

1. **Go to Admin Settings tab**
2. **Update Business Profile:**
   - Business Name: Your business name
   - Business Phone: Your contact number
   - Business Address: Your address
   - Custom Messages: Header/footer for receipts

3. **Click "সংরক্ষণ করুন (Save)"**

---

## ✅ Step 10: Test Everything

### 10.1 Test Checklist

- [ ] Website loads successfully
- [ ] Database connection works
- [ ] Can add new clients
- [ ] Can create bills
- [ ] WhatsApp messages send successfully
- [ ] Print functionality works
- [ ] Admin panel accessible
- [ ] Settings save correctly
- [ ] Edit bills feature works
- [ ] Backup system works

### 10.2 Create Test Bill

1. **Add a test client** with your own phone number
2. **Create a test bill**
3. **Send via WhatsApp** to yourself
4. **Verify message received**
5. **Delete test data** if satisfied

---

## 🔄 PM2 Management Commands

```bash
# View application status
pm2 status

# View logs (last 200 lines)
pm2 logs billing-system --lines 200

# Restart application
pm2 restart billing-system

# Stop application
pm2 stop billing-system

# Start application
pm2 start billing-system

# Delete from PM2
pm2 delete billing-system

# Monitor in real-time
pm2 monit
```

---

## 🆘 Troubleshooting

### Issue 1: "Cannot connect to database"

**Solution:**
```bash
# Verify database credentials in .env
cat .env

# Test database connection
mysql -u techandc_bot -p
# Enter password when prompted
# If successful, database credentials are correct

# Check if database exists
SHOW DATABASES;
USE techandc_accounts;
SHOW TABLES;
```

### Issue 2: "Port 3000 already in use"

**Solution:**
```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process (if needed)
kill -9 <PID>

# Or change port in .env
PORT=3001
```

### Issue 3: "npm: command not found"

**Solution:**
```bash
# Install Node.js and npm
# Contact your hosting provider for Node.js installation
# Or use cPanel's "Setup Node.js App" feature
```

### Issue 4: "Permission denied"

**Solution:**
```bash
# Fix file permissions
chmod -R 755 ~/public_html/billing
chmod 600 .env

# Fix ownership
chown -R username:username ~/public_html/billing
```

### Issue 5: WhatsApp not connecting

**Solution:**
1. Check if server has internet access
2. Verify port 443 is open (WhatsApp uses it)
3. Clear WhatsApp cache:
   ```bash
   rm -rf .wwebjs_auth
   rm -rf .wwebjs_cache
   ```
4. Restart server and scan QR again

### Issue 6: Application crashes after restart

**Solution:**
```bash
# Check PM2 logs for errors
pm2 logs billing-system --err

# Common causes:
# 1. Database connection failed → Check .env
# 2. Port already in use → Change PORT in .env
# 3. Missing dependencies → Run npm install again
```

---

## 🔄 Updating the Application

### Step 1: Backup Current Installation

```bash
# Backup database
mysqldump -u techandc_bot -p techandc_accounts > backup_$(date +%Y%m%d).sql

# Backup files
tar -czf backup_$(date +%Y%m%d).tar.gz .
```

### Step 2: Pull Latest Changes

```bash
cd ~/public_html/billing

# Stash local changes (if any)
git stash

# Pull latest code
git pull origin main

# Restore local .env if overwritten
git checkout .env
```

### Step 3: Update Dependencies

```bash
npm install
```

### Step 4: Run Migrations (if any)

```bash
node migrate_to_ledger.js
```

### Step 5: Restart Application

```bash
pm2 restart billing-system
```

---

## 🔐 Security Best Practices

### 1. Secure Database Credentials

```bash
# Make .env readable only by owner
chmod 600 .env

# Never commit .env to git
# (already in .gitignore)
```

### 2. Use Strong Passwords

- Database password: Mix of letters, numbers, symbols
- Admin panel password: Strong and unique
- Change default passwords immediately

### 3. Keep Dependencies Updated

```bash
# Check for updates
npm outdated

# Update packages
npm update
```

### 4. Enable Firewall

```bash
# Allow only necessary ports
# Port 22 (SSH), 80 (HTTP), 443 (HTTPS), 3000 (App)
```

### 5. Regular Backups

- Set up automatic database backups (daily)
- Use the built-in backup system
- Store backups in secure location

---

## 📊 Monitoring & Maintenance

### Daily Tasks

- Check PM2 status: `pm2 status`
- Review logs: `pm2 logs billing-system --lines 50`
- Verify WhatsApp connection

### Weekly Tasks

- Check disk space: `df -h`
- Review error logs
- Test backup/restore
- Update license keys (if expiring)

### Monthly Tasks

- Update dependencies: `npm update`
- Security audit: `npm audit`
- Database optimization
- Performance review

---

## 🎉 Production Ready!

Your POS Billing System is now live and running on production server!

**Quick Links:**
- 🌐 Application: `http://your-domain.com:3000`
- 🔧 Admin Panel: `http://your-domain.com:3000/admin_panel.html`
- 📊 phpMyAdmin: `http://your-domain.com/phpmyadmin`

**Support Contacts:**
- 📱 WhatsApp: 01739354392
- 💬 Facebook: fb.com/sajibrasel2
- 📧 Email: raselsajib25@gmail.com

---

## 📝 Next Steps

1. ✅ Add your first real client
2. ✅ Generate your first production bill
3. ✅ Configure license system (if selling to others)
4. ✅ Set up regular backups
5. ✅ Monitor performance and logs

**Happy Billing! 💼📱✨**
