# Quick Installation Guide - POS Billing System

## 📋 Prerequisites

- **XAMPP** installed and running (MySQL + Apache)
- **Node.js** (v14 or higher)
- **WhatsApp** account on smartphone

---

## ⚡ Quick Start (5 Minutes)

### 1. Start XAMPP
```
✓ Open XAMPP Control Panel
✓ Start MySQL
✓ Ensure MySQL shows "Running" (green)
```

### 2. Install Dependencies
```bash
cd your-project-folder
npm install
```

### 3. Start Server
```bash
npm start
```

**You'll see:**
```
✅ Connected to MySQL server
✅ Database 'local_billing_db' created/verified
✅ Table "clients" created/verified
✅ Table "transactions" created/verified
✅ Table "settings" created/verified
✅ Table "bill_items" created/verified
🎉 Database & Tables auto-configured successfully

🔄 Initializing WhatsApp client...
🚀 Server is running on http://localhost:3000
```

### 4. Open Dashboard
```
http://localhost:3000
```

### 5. Connect WhatsApp
```
✓ Click "Admin Settings" tab
✓ Scan the QR code with WhatsApp
✓ Wait for "✅ WhatsApp Connected & Ready"
```

### 6. Configure Business
```
✓ In Admin Settings, fill:
  - Business Name
  - Business Phone
  - Business Address (optional)
  - Header/Footer Messages
✓ Click "Save Settings"
```

### 7. Create First Bill
```
✓ Go to "Create Bill" tab
✓ Add a client first (if none exist)
✓ Select client from dropdown
✓ Add items (Item name, Quantity, Rate)
✓ Add discount (optional)
✓ Click "Generate & Send WhatsApp Bill"
```

---

## 🎯 That's It!

Your professional POS billing system is now running!

---

## 📁 What Was Created

### Database: `local_billing_db`
- `clients` - Customer information
- `transactions` - Bill records
- `bill_items` - Itemized billing
- `settings` - Business profile

### Files Created:
- `.wwebjs_auth/` - WhatsApp session (auto-generated)

---

## 🔧 Troubleshooting

### MySQL Not Starting
```
→ Check port 3306 is not in use
→ Restart XAMPP
→ Check XAMPP logs
```

### Port 3000 Already in Use
```
→ Edit .env file
→ Change PORT=3000 to PORT=3001
→ Restart server
```

### WhatsApp QR Not Appearing
```
→ Wait 15 seconds after server start
→ Refresh Admin Settings tab
→ Check terminal for QR code as backup
```

### Database Connection Failed
```
→ Ensure XAMPP MySQL is running
→ Check .env credentials (default: root, no password)
→ Verify port 3306 is accessible
```

---

## 📱 Test Your System

1. **Add a test client:**
   - Go to Clients tab
   - Name: Test User
   - Phone: 01712345678

2. **Create a test bill:**
   - Go to Create Bill tab
   - Select Test User
   - Add item: "Typing" Qty: 2, Rate: 50
   - Click Generate

3. **Check WhatsApp:**
   - Your phone should receive the bill!

---

## 🎉 Congratulations!

Your POS system is ready for production use!

**Dashboard URL:** http://localhost:3000

**Admin Settings:** For WhatsApp QR and business profile

**Support:** Check UPGRADE_NOTES.md for detailed documentation

---

## 🔐 Security Notes

- System is for localhost use
- Don't expose port 3000 to internet
- Keep `.env` and `.wwebjs_auth/` private
- Default MySQL password is empty (XAMPP default)

---

## 📈 Next Steps

1. Configure your business details
2. Add your real clients
3. Customize receipt messages
4. Start generating professional bills!

---

**Enjoy your Professional POS Billing System! 🚀**
