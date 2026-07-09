# ⚡ Quick Start - Production Deployment

**5-minute guide to get your POS Billing System live on production server!**

---

## 🎯 Prerequisites

✅ cPanel access  
✅ SSH access (or File Manager)  
✅ Node.js enabled on server  
✅ 5 minutes of your time

---

## 🚀 Step-by-Step (5 Minutes)

### Step 1: Create Database (2 minutes)

1. **Login to cPanel**
2. **MySQL Databases**
3. **Create database:** `techandc_accounts`
4. **Create user:** `techandc_bot`
5. **Password:** `12345Sajibs6@`
6. **Add user to database** → ALL PRIVILEGES

**⚠️ Note your actual credentials:**
- If cPanel adds prefix: `yoursite_techandc_accounts`
- If cPanel adds prefix: `yoursite_techandc_bot`

---

### Step 2: Upload Code (1 minute)

**Option A: Git (SSH)** ⭐ Recommended
```bash
ssh username@your-server.com
cd ~/public_html
mkdir billing && cd billing
git clone https://github.com/sajibrasel2/accounts.git .
```

**Option B: File Manager**
1. Download ZIP from: https://github.com/sajibrasel2/accounts
2. Upload to cPanel File Manager
3. Extract to `public_html/billing/`

---

### Step 3: Configure Database (30 seconds)

**If NO prefix added:** ✅ Skip this step (already configured!)

**If prefix added:**
1. Open `.env` file
2. Update these lines:
```env
DB_USER=yoursite_techandc_bot
DB_NAME=yoursite_techandc_accounts
```

---

### Step 4: Install & Start (1.5 minutes)

```bash
# SSH into server
cd ~/public_html/billing

# Install dependencies
npm install

# Initialize database
node migrate_to_ledger.js

# Install PM2
npm install -g pm2

# Start server
pm2 start server.js --name billing-system
pm2 save
pm2 startup
```

---

### Step 5: Access & Test (30 seconds)

**Open in browser:**
```
http://your-domain.com:3000
```

**Connect WhatsApp:**
1. Go to Admin Settings tab
2. Scan QR code
3. ✅ Done!

---

## 🎉 That's It!

Your POS Billing System is now LIVE! 🚀

**Next steps:**
1. Update business info in Admin Settings
2. Add your first client
3. Create your first bill
4. Celebrate! 🎊

---

## 📱 Quick Access Links

- **Main Dashboard:** `http://your-domain.com:3000`
- **Admin Panel:** `http://your-domain.com:3000/admin_panel.html`
  - Email: `raselsajib25@gmail.com`
  - Password: `12345Sajibs6@`

---

## 🆘 Troubleshooting

### "Cannot connect to database"
```bash
# Check .env file
cat .env | grep DB_

# Verify credentials match cPanel database
```

### "Port 3000 already in use"
```bash
# Check what's using port 3000
lsof -i :3000

# Or change port in .env
echo "PORT=3001" >> .env
pm2 restart billing-system
```

### "npm: command not found"
- Use cPanel → Setup Node.js App instead
- Or contact hosting support to enable Node.js

---

## 📚 Need More Details?

- **Complete Guide:** Read `DEPLOYMENT_GUIDE.md`
- **All Features:** Read `README.md`
- **Environment Switch:** Read `ENVIRONMENT_SWITCH_GUIDE.md`
- **Full Summary:** Read `GITHUB_DEPLOYMENT_SUMMARY.md`

---

## 💬 Get Help

- 📱 WhatsApp: 01739354392
- 💬 Facebook: fb.com/sajibrasel2
- 📧 Email: raselsajib25@gmail.com

---

**🎊 Congratulations! Your business is now digitally powered! 💼✨**
