# 🚀 Quick Start Guide for XAMPP Users

This guide is specifically for users running **XAMPP** on Windows/Linux. Everything is fully automated - no manual database setup required!

## ✅ Step-by-Step Setup (5 Minutes)

### 1. Start XAMPP
- Open **XAMPP Control Panel**
- Click **Start** for **Apache** module
- Click **Start** for **MySQL** module
- Both should show green **"Running"** status

### 2. Install Node.js Dependencies
Open Command Prompt or Terminal in the project folder:
```bash
npm install
```

### 3. Start the Application
```bash
npm start
```

That's it! The system will automatically:
- ✅ Connect to XAMPP MySQL
- ✅ Create database `local_billing_db`
- ✅ Create `clients` table
- ✅ Create `transactions` table
- ✅ Initialize WhatsApp

### 4. Scan WhatsApp QR Code
A QR code will appear in your terminal. Scan it with WhatsApp on your phone:
1. Open WhatsApp
2. Go to **Settings → Linked Devices**
3. Click **Link a Device**
4. Scan the QR code

### 5. Open the Dashboard
Open your browser and go to:
```
http://localhost:3000
```

---

## 🎯 What You'll See in Console

```
🔄 Starting automatic database configuration...
✅ Connected to MySQL server
✅ Database 'local_billing_db' created/verified
✅ Table "clients" created/verified
✅ Table "transactions" created/verified
🎉 Database & Tables auto-configured successfully

🔄 Initializing WhatsApp client...

📱 Scan this QR code with WhatsApp on your phone:
[QR CODE APPEARS HERE]

✅ WhatsApp authenticated successfully
✅ WhatsApp client is ready!

🚀 Server is running on http://localhost:3000
📊 Dashboard: http://localhost:3000
```

---

## 🔍 Verify Database (Optional)

If you want to verify the database was created:

1. Open **phpMyAdmin**: http://localhost/phpmyadmin
2. Look for database **`local_billing_db`** in the left sidebar
3. You should see two tables:
   - `clients`
   - `transactions`

---

## ⚙️ XAMPP Default Configuration

The system uses these XAMPP defaults (no changes needed):

| Setting | Value |
|---------|-------|
| Host | localhost |
| User | root |
| Password | *(empty)* |
| Port | 3306 |

These are pre-configured in the `.env` file.

---

## ❌ Common Issues

### "Error: connect ECONNREFUSED"
**Problem:** MySQL is not running  
**Solution:** Start MySQL in XAMPP Control Panel

### "Port 3000 already in use"
**Problem:** Another app is using port 3000  
**Solution:** Change port in `.env` file:
```env
PORT=3001
```

### "Database connection failed"
**Problem:** XAMPP MySQL module is not started  
**Solution:** Open XAMPP Control Panel and click "Start" for MySQL

---

## 🎉 You're Done!

Your billing system is now running and connected to XAMPP. Start adding clients and sending bills via WhatsApp!

**Dashboard:** http://localhost:3000
